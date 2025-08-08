package io.mosip.compass.admin.service.impl;

import io.mosip.compass.admin.dto.ApplicationSearchResultDTO;
import io.mosip.compass.admin.dto.ApplicationSearchResponseDTO;
import io.mosip.compass.admin.entity.UserInfo;
import io.mosip.compass.admin.repository.UserInfoRepository;
import io.mosip.compass.admin.service.ApplicationSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationSearchServiceImpl implements ApplicationSearchService {

    private final UserInfoRepository userInfoRepository;

    @Override
    @Transactional(readOnly = true)
    public ApplicationSearchResponseDTO searchApplications(
            String nationalId,
            String firstName,
            String lastName,
            LocalDate issuedDateFrom,
            LocalDate issuedDateTo,
            LocalDate issueDate,
            String can,
            String searchText, // New parameter
            Integer page,
            Integer size,
            String sortBy,
            String sortOrder) {

        try {
            // Create specification for search
            Specification<UserInfo> spec = createCANSearchSpecification(
                    sanitizeInput(nationalId),
                    sanitizeInput(firstName),
                    sanitizeInput(lastName),
                    issuedDateFrom,
                    issuedDateTo,
                    issueDate,
                    sanitizeInput(can),
                    sanitizeInput(searchText) // Pass searchText
            );

            // Create pageable
            Pageable pageable = createPageable(page, size, sortBy, sortOrder);

            // Execute search
            Page<UserInfo> results = userInfoRepository.findAll(spec, pageable);

            // Convert and return results
            return buildResponse(results, page, size);

        } catch (Exception e) {
            log.error("Error during search", e);
            return ApplicationSearchResponseDTO.empty(page != null ? page : 1, size != null ? size : 10,
                    "Search failed: " + e.getMessage());
        }
    }

    private Specification<UserInfo> createCANSearchSpecification(
            String nationalId, String firstName, String lastName,
            LocalDate issuedDateFrom, LocalDate issuedDateTo, LocalDate issueDate,
            String can, String searchText) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // **General Search Text - searches across all fields**
            if (searchText != null && !searchText.trim().isEmpty()) {
                String searchTerm = searchText.toLowerCase().trim();

                Predicate nationalIdPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("nationalUid")),
                        "%" + searchTerm + "%"
                );

                Predicate firstNamePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("firstNamePrimary")),
                        "%" + searchTerm + "%"
                );

                Predicate lastNamePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("lastNameSecondary")),
                        "%" + searchTerm + "%"
                );

                Predicate canPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("cardAccessNumber")),
                        "%" + searchTerm + "%"
                );

                // For date search, try to match the searchText as date string
                Predicate datePredicate = null;
                try {
                    // Try to parse as date (yyyy-MM-dd format)
                    if (searchTerm.matches("\\d{4}-\\d{2}-\\d{2}")) {
                        LocalDate searchDate = LocalDate.parse(searchTerm);
                        datePredicate = criteriaBuilder.equal(
                                criteriaBuilder.function("DATE", java.sql.Date.class, root.get("createdTimes")),
                                searchDate
                        );
                    }
                } catch (Exception e) {
                    // Ignore date parsing errors
                }

                // Combine all search predicates with OR
                if (datePredicate != null) {
                    predicates.add(criteriaBuilder.or(
                            nationalIdPredicate,
                            firstNamePredicate,
                            lastNamePredicate,
                            canPredicate,
                            datePredicate
                    ));
                } else {
                    predicates.add(criteriaBuilder.or(
                            nationalIdPredicate,
                            firstNamePredicate,
                            lastNamePredicate,
                            canPredicate
                    ));
                }
            } else {
                // **Existing individual field searches (unchanged)**
                // National ID search
                if (nationalId != null && !nationalId.trim().isEmpty()) {
                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("nationalUid")),
                            "%" + nationalId.toLowerCase().trim() + "%"
                    ));
                }

                // First name search
                if (firstName != null && !firstName.trim().isEmpty()) {
                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("firstNamePrimary")),
                            "%" + firstName.toLowerCase().trim() + "%"
                    ));
                }

                // Last name search
                if (lastName != null && !lastName.trim().isEmpty()) {
                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("lastNameSecondary")),
                            "%" + lastName.toLowerCase().trim() + "%"
                    ));
                }

                // CAN SEARCH - Partial and Exact Match
                if (can != null && !can.trim().isEmpty()) {
                    String searchTerm = can.trim();
                    if (searchTerm.length() == 10 && searchTerm.matches("^[a-zA-Z0-9]{10}$")) {
                        // Exact match for full CAN
                        predicates.add(criteriaBuilder.equal(
                                criteriaBuilder.lower(root.get("cardAccessNumber")),
                                searchTerm.toLowerCase()
                        ));
                    } else {
                        // Partial match for incomplete CAN
                        predicates.add(criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("cardAccessNumber")),
                                "%" + searchTerm.toLowerCase() + "%"
                        ));
                    }
                }
            }

            // **Date filtering (applies to both general and specific searches)**
            // EXACT ISSUE DATE SEARCH - Priority over date range
            if (issueDate != null) {
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.function("DATE", java.sql.Date.class, root.get("createdTimes")),
                        issueDate
                ));
            } else {
                // Date range filtering (only if exact date is not specified)
                if (issuedDateFrom != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                            root.get("createdTimes"), issuedDateFrom.atStartOfDay()
                    ));
                }

                if (issuedDateTo != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(
                            root.get("createdTimes"), issuedDateTo.atTime(23, 59, 59)
                    ));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private String sanitizeInput(String input) {
        if (input == null) return null;
        return input.trim()
                .replaceAll("[%_\\\\]", "\\\\$0") // Escape SQL wildcards
                .replaceAll("[^a-zA-Z0-9\\s-]", ""); // Keep alphanumeric, spaces, and hyphens for general search
    }

    private Pageable createPageable(Integer page, Integer size, String sortBy, String sortOrder) {
        page = (page != null && page > 0) ? page - 1 : 0;
        size = (size != null && size > 0) ? Math.min(size, 100) : 10;
        sortBy = mapSortField(sortBy != null ? sortBy : "createdTimes");
        Sort.Direction direction = "asc".equalsIgnoreCase(sortOrder) ?
                Sort.Direction.ASC : Sort.Direction.DESC;

        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    private String mapSortField(String sortBy) {
        return switch (sortBy.toLowerCase()) {
            case "can" -> "cardAccessNumber";
            case "nationalid", "nationalId" -> "nationalUid";
            case "firstname", "firstName" -> "firstNamePrimary";
            case "lastname", "lastName" -> "lastNameSecondary";
            case "issueddate", "issuedDate" -> "createdTimes";
            default -> "createdTimes";
        };
    }

    private ApplicationSearchResponseDTO buildResponse(Page<UserInfo> results, Integer page, Integer size) {
        List<ApplicationSearchResultDTO> applications = results.getContent()
                .stream()
                .map(this::convertToDTO)
                .toList();

        return ApplicationSearchResponseDTO.builder()
                .page(page != null ? page : 1)
                .size(size != null ? size : 10)
                .totalResults(results.getTotalElements())
                .totalPages(results.getTotalPages())
                .applications(applications)
                .message(applications.isEmpty() ? "No records found" : null)
                .build();
    }

    private ApplicationSearchResultDTO convertToDTO(UserInfo userInfo) {
        return ApplicationSearchResultDTO.builder()
                .nationalId(userInfo.getNationalUid())
                .firstName(userInfo.getFirstNamePrimary())
                .lastName(userInfo.getLastNameSecondary())
                .issuedDate(userInfo.getCreatedTimes() != null ? userInfo.getCreatedTimes().toLocalDate() : null)
                .can(userInfo.getCardAccessNumber())
                .build();
    }
}
