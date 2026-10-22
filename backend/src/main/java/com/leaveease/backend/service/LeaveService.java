
package com.leaveease.backend.service;

import com.leaveease.backend.model.LeaveRequest;
import com.leaveease.backend.model.User;
import com.leaveease.backend.repository.LeaveRepository;
import com.leaveease.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;

    public LeaveService(
            LeaveRepository leaveRepository,
            UserRepository userRepository) {
        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
    }

    // Apply for leave
    public LeaveRequest applyLeave(LeaveRequest leaveRequest) {

        if (leaveRequest.getUser() == null
                || leaveRequest.getUser().getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User ID is required");
        }

        User user = userRepository.findById(
                leaveRequest.getUser().getId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"));

        if (leaveRequest.getLeaveType() == null
                || leaveRequest.getLeaveType().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Leave type is required");
        }

        if (leaveRequest.getStartDate() == null
                || leaveRequest.getEndDate() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Start date and end date are required");
        }

        if (leaveRequest.getStartDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Start date cannot be in the past");
        }

        if (leaveRequest.getEndDate().isBefore(
                leaveRequest.getStartDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "End date cannot be before start date");
        }

        if (leaveRequest.getReason() == null
                || leaveRequest.getReason().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Reason is required");
        }

        leaveRequest.setUser(user);
        leaveRequest.setStatus("PENDING");

        return leaveRepository.save(leaveRequest);
    }

    // Get all leave requests
    public List<LeaveRequest> getAllLeaves() {
        return leaveRepository.findAll();
    }

    // Get leave requests for a specific employee
    public List<LeaveRequest> getLeavesByUserId(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found");
        }

        return leaveRepository.findByUserId(userId);
    }

    // Approve a leave request
    @Transactional
    public LeaveRequest approveLeave(Long id) {
        return updateLeaveStatus(id, "APPROVED");
    }

    // Reject a leave request
    @Transactional
    public LeaveRequest rejectLeave(Long id) {
        return updateLeaveStatus(id, "REJECTED");
    }

    // Update leave status
    private LeaveRequest updateLeaveStatus(
            Long id, String newStatus) {

        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Leave request not found"));

        if (!"PENDING".equalsIgnoreCase(leave.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only pending leave requests can be updated");
        }

        leave.setStatus(newStatus);

        return leaveRepository.save(leave);
    }

    // Cancel a pending leave request
    public void cancelLeave(Long id) {

        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Leave request not found"));

        if (!"PENDING".equalsIgnoreCase(leave.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only pending leave requests can be cancelled");
        }

        leaveRepository.delete(leave);
    }
}
