package io.mosip.compass.admin.controller;

import io.mosip.compass.admin.config.RequiresAdminAccess;
import io.mosip.compass.admin.dto.ApplicationSearchResponseDTO;
import io.mosip.compass.admin.service.ApplicationSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Validated
@Slf4j
public class ApplicationSearchController {

    private final ApplicationSearchService applicationSearchService;

    @Operation(
            summary = "Search applications with pagination and sorting",
            description = "Search applications by various criteria with support for pagination, sorting, and filtering. All search parameters are optional. Use searchText for general search across all fields, or use specific parameters for targeted search. Use issueDate for exact date matching or issuedDateFrom/issuedDateTo for date range filtering.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @RequiresAdminAccess
    @GetMapping("/search")
    public ResponseEntity<ApplicationSearchResponseDTO> searchApplications(
            @Parameter(description = "National ID - partial or full match, case-insensitive")
            @RequestParam(required = false)
            @Size(max = 255, message = "National ID cannot exceed 255 characters")
            String nationalId,

            @Parameter(description = "First name - partial or full match, case-insensitive")
            @RequestParam(required = false)
            @Size(max = 100, message = "First name cannot exceed 100 characters")
            String firstName,

            @Parameter(description = "Last name - partial or full match, case-insensitive")
            @RequestParam(required = false)
            @Size(max = 100, message = "Last name cannot exceed 100 characters")
            String lastName,

            @Parameter(description = "Start date for issued date range (YYYY-MM-DD format)")
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate issuedDateFrom,

            @Parameter(description = "End date for issued date range (YYYY-MM-DD format)")
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate issuedDateTo,

            @Parameter(description = "Exact issue date (YYYY-MM-DD format) - takes priority over date range")
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate issueDate,

            @Parameter(description = "Card Access Number - partial or full match")
            @RequestParam(required = false)
            @Size(max = 50, message = "CAN cannot exceed 50 characters")
            String can,

            @Parameter(description = "General search text - searches across nationalId, firstName, lastName, CAN, and issueDate fields")
            @RequestParam(required = false)
            @Size(max = 255, message = "Search text cannot exceed 255 characters")
            String searchText,

            @Parameter(description = "Page number (1-based)")
            @RequestParam(defaultValue = "1")
            @Min(value = 1, message = "Page must be at least 1")
            @Max(value = 1000, message = "Page cannot exceed 1000")
            Integer page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "Size must be at least 1")
            @Max(value = 100, message = "Size cannot exceed 100")
            Integer size,

            @Parameter(description = "Sort field (issuedDate, firstName, lastName, nationalId, can)")
            @RequestParam(defaultValue = "issuedDate")
            @Pattern(regexp = "^(issuedDate|firstName|lastName|nationalId|can)$",
                    message = "Sort field must be one of: issuedDate, firstName, lastName, nationalId, can")
            String sortBy,

            @Parameter(description = "Sort order (asc or desc)")
            @RequestParam(defaultValue = "desc")
            @Pattern(regexp = "^(asc|desc)$", message = "Sort order must be either 'asc' or 'desc'")
            String sortOrder

    ) {
        log.info("Search request received - nationalId: {}, firstName: {}, lastName: {}, issueDate: {}, searchText: {}, page: {}, size: {}, sortBy: {}, sortOrder: {}",
                nationalId, firstName, lastName, issueDate, searchText, page, size, sortBy, sortOrder);

        ApplicationSearchResponseDTO response = applicationSearchService.searchApplications(
                nationalId, firstName, lastName, issuedDateFrom, issuedDateTo,
                issueDate, can, searchText, page, size, sortBy, sortOrder
        );

        log.info("Search completed - totalResults: {}, totalPages: {}",
                response.getTotalResults(), response.getTotalPages());

        return ResponseEntity.ok(response);
    }
}
