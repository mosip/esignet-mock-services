package io.mosip.compass.admin.service.impl;

import io.mosip.compass.admin.constants.DbFields;
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
            String cardAccessNumber,
            String searchText,
            Integer page,
            Integer size,
            String sortBy,
            String sortOrder) {

        Specification<UserInfo> spec = createCardAccessNumberSearchSpecification(
                sanitizeInput(nationalId),
                sanitizeInput(firstName),
                sanitizeInput(lastName),
                issuedDateFrom,
                issuedDateTo,
                issueDate,
                sanitizeInput(cardAccessNumber),
                sanitizeInput(searchText)
        );

        Pageable pageable = createPageable(page, size, sortBy, sortOrder);
        Page<UserInfo> results = userInfoRepository.findAll(spec, pageable);

        return buildResponse(results, page, size);
    }

    private Specification<UserInfo> createCardAccessNumberSearchSpecification(
            String nationalId,
            String firstName,
            String lastName,
            LocalDate issuedDateFrom,
            LocalDate issuedDateTo,
            LocalDate issueDate,
            String cardAccessNumber,
            String searchText) {

        return (root, query, criteriaBuilder) ->
                buildPredicate(root, query, criteriaBuilder,
                        nationalId, firstName, lastName,
                        issuedDateFrom, issuedDateTo, issueDate,
                        cardAccessNumber, searchText);
    }

    private Predicate buildPredicate(
            jakarta.persistence.criteria.Root<UserInfo> root,
            jakarta.persistence.criteria.CriteriaQuery<?> query,
            jakarta.persistence.criteria.CriteriaBuilder criteriaBuilder,
            String nationalId,
            String firstName,
            String lastName,
            LocalDate issuedDateFrom,
            LocalDate issuedDateTo,
            LocalDate issueDate,
            String cardAccessNumber,
            String searchText) {

        List<Predicate> predicates = new ArrayList<>();

        if (searchText != null && !searchText.trim().isEmpty()) {
            String searchTerm = searchText.toLowerCase().trim();

            Predicate nationalIdPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get(DbFields.NATIONAL_UID)),
                    DbFields.PERCENT + searchTerm + DbFields.PERCENT
            );
            Predicate firstNamePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get(DbFields.FIRST_NAME_PRIMARY)),
                    DbFields.PERCENT + searchTerm + DbFields.PERCENT
            );
            Predicate lastNamePredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get(DbFields.LAST_NAME_SECONDARY)),
                    DbFields.PERCENT + searchTerm + DbFields.PERCENT
            );
            Predicate cardAccessNumberPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get(DbFields.CARD_ACCESS_NUMBER)),
                    DbFields.PERCENT + searchTerm + DbFields.PERCENT
            );
            Predicate datePredicate = null;
            try {
                if (searchTerm.matches("\\d{4}-\\d{2}-\\d{2}")) {
                    LocalDate searchDate = LocalDate.parse(searchTerm);
                    datePredicate = criteriaBuilder.equal(
                            criteriaBuilder.function("DATE", java.sql.Date.class, root.get(DbFields.CREATED_TIMES)),
                            searchDate
                    );
                }
            } catch (Exception e) {
                log.debug("Failed to parse searchText '{}' as date - continuing without date predicate: {}", searchTerm, e.getMessage());
            }
            if (datePredicate != null) {
                predicates.add(criteriaBuilder.or(
                        nationalIdPredicate,
                        firstNamePredicate,
                        lastNamePredicate,
                        cardAccessNumberPredicate,
                        datePredicate
                ));
            } else {
                predicates.add(criteriaBuilder.or(
                        nationalIdPredicate,
                        firstNamePredicate,
                        lastNamePredicate,
                        cardAccessNumberPredicate
                ));
            }
        } else {
            if (nationalId != null && !nationalId.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get(DbFields.NATIONAL_UID)),
                        DbFields.PERCENT + nationalId.toLowerCase().trim() + DbFields.PERCENT
                ));
            }

            if (firstName != null && !firstName.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get(DbFields.FIRST_NAME_PRIMARY)),
                        DbFields.PERCENT + firstName.toLowerCase().trim() + DbFields.PERCENT
                ));
            }

            if (lastName != null && !lastName.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get(DbFields.LAST_NAME_SECONDARY)),
                        DbFields.PERCENT + lastName.toLowerCase().trim() + DbFields.PERCENT
                ));
            }

            if (cardAccessNumber != null && !cardAccessNumber.trim().isEmpty()) {
                String searchTerm = cardAccessNumber.trim();
                if (searchTerm.length() == 10 && searchTerm.matches("^[a-zA-Z0-9]{10}$")) {
                    predicates.add(criteriaBuilder.equal(
                            criteriaBuilder.lower(root.get(DbFields.CARD_ACCESS_NUMBER)),
                            searchTerm.toLowerCase()
                    ));
                } else {
                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(root.get(DbFields.CARD_ACCESS_NUMBER)),
                            DbFields.PERCENT + searchTerm.toLowerCase() + DbFields.PERCENT
                    ));
                }
            }
            if (issueDate != null) {
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.function("DATE", java.sql.Date.class, root.get(DbFields.CREATED_TIMES)),
                        issueDate
                ));
            } else {
                if (issuedDateFrom != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                            root.get(DbFields.CREATED_TIMES), issuedDateFrom.atStartOfDay()
                    ));
                }
                if (issuedDateTo != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(
                            root.get(DbFields.CREATED_TIMES), issuedDateTo.atTime(23, 59, 59)
                    ));
                }
            }
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }

    private String sanitizeInput(String input) {
        if (input == null) return null;
        return input.trim()
                .replaceAll("[%_\\\\]", "\\\\$0")
                .replaceAll("[^a-zA-Z0-9\\s-]", "");
    }

    private Pageable createPageable(Integer page, Integer size, String sortBy, String sortOrder) {
        page = (page != null && page > 0) ? page - 1 : 0;
        size = (size != null && size > 0) ? Math.min(size, 100) : 10;
        sortBy = mapSortField(sortBy != null ? sortBy : DbFields.CREATED_TIMES);
        Sort.Direction direction = "asc".equalsIgnoreCase(sortOrder) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(direction, sortBy));
    }

    private String mapSortField(String sortBy) {
        return switch (sortBy.toLowerCase()) {
            case "cardaccessnumber", "cardAccessNumber" -> DbFields.CARD_ACCESS_NUMBER;
            case "nationalid", "nationalId" -> DbFields.NATIONAL_UID;
            case "firstname", "firstName" -> DbFields.FIRST_NAME_PRIMARY;
            case "lastname", "lastName" -> DbFields.LAST_NAME_SECONDARY;
            case "issueddate", "issuedDate" -> DbFields.CREATED_TIMES;
            default -> DbFields.CREATED_TIMES;
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
                .cardAccessNumber(userInfo.getCardAccessNumber())
                .build();
    }
}
