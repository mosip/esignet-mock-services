package io.mosip.compass.admin.service;

import io.mosip.compass.admin.dto.ApplicationSearchResponseDTO;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public interface ApplicationSearchService {

    ApplicationSearchResponseDTO searchApplications(
            String nationalId,
            String firstName,
            String lastName,
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate issuedDateFrom,
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate issuedDateTo,
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate issueDate,
            String can,
            String searchText, // New parameter for general search
            Integer page,
            Integer size,
            String sortBy,
            String sortOrder
    );
}
