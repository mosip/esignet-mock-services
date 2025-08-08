package io.mosip.compass.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationSearchResponseDTO {

    private Integer page;
    private Integer size;
    private Long totalResults;
    private Integer totalPages;
    private List<ApplicationSearchResultDTO> applications;
    private String message;

    public static ApplicationSearchResponseDTO empty(Integer page, Integer size, String message) {
        return ApplicationSearchResponseDTO.builder()
                .page(page)
                .size(size)
                .totalResults(0L)
                .totalPages(0)
                .applications(List.of())
                .message(message)
                .build();
    }
}
