package com.trung.controller;

import com.trung.dto.request.PageRequestDTO;
import com.trung.dto.request.RoundCriterionCreateRequest;
import com.trung.dto.request.RoundCriterionUpdateRequest;
import com.trung.dto.response.ApiResponse;
import com.trung.dto.response.PageResponseDTO;
import com.trung.dto.response.RoundCriterionResponse;
import com.trung.exception.ResourceNotFoundException;
import com.trung.service.IRoundCriteriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/round-criterias")
@RequiredArgsConstructor
public class RoundCriteriaController {
    private final IRoundCriteriaService roundCriteriaService;

    @GetMapping
    public ResponseEntity<PageResponseDTO<RoundCriterionResponse>> getCriterionInRound(@RequestParam Long roundId,
                                                                                       @ModelAttribute PageRequestDTO pageRequestDTO) throws ResourceNotFoundException {
        return new ResponseEntity<>(roundCriteriaService.getAllCriteriaInRound(roundId, pageRequestDTO), HttpStatus.OK);
    }

    @GetMapping("/{roundCriteriaId}")
    public ResponseEntity<ApiResponse<RoundCriterionResponse>> getCriterionInRoundById(@PathVariable Long roundCriteriaId) throws ResourceNotFoundException {
        return new ResponseEntity<>(roundCriteriaService.getCriterionInRoundById(roundCriteriaId), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoundCriterionResponse>> createCriterionInRound(@Valid @RequestBody RoundCriterionCreateRequest request) throws ResourceNotFoundException {
        return new ResponseEntity<>(roundCriteriaService.createCriterionInRound(request), HttpStatus.CREATED);
    }

    @PutMapping("/{roundCriteriaId}")
    public ResponseEntity<ApiResponse<RoundCriterionResponse>> updateWeight(@PathVariable Long roundCriteriaId, @Valid @RequestBody RoundCriterionUpdateRequest request) throws ResourceNotFoundException {
        return new ResponseEntity<>(roundCriteriaService.updateWeight(roundCriteriaId, request), HttpStatus.OK);
    }

    @DeleteMapping("/{roundCriteriaId}")
    public ResponseEntity<ApiResponse<String>> deleteCriterionInRound(@PathVariable Long roundCriteriaId) throws ResourceNotFoundException {
        return new ResponseEntity<>(roundCriteriaService.deleteCriterionInRound(roundCriteriaId), HttpStatus.OK);
    }
}
