
package com.leaveease.backend.controller;

import com.leaveease.backend.model.LeaveRequest;
import com.leaveease.backend.service.LeaveService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // Apply for leave
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LeaveRequest applyLeave(
            @RequestBody LeaveRequest leaveRequest) {
        return leaveService.applyLeave(leaveRequest);
    }

    // Get all leave requests
    @GetMapping
    public List<LeaveRequest> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    // Get leave requests by employee ID
    @GetMapping("/user/{userId}")
    public List<LeaveRequest> getLeavesByUserId(
            @PathVariable Long userId) {
        return leaveService.getLeavesByUserId(userId);
    }

    // Approve leave
    @PutMapping("/{id}/approve")
    public LeaveRequest approveLeave(@PathVariable Long id) {
        return leaveService.approveLeave(id);
    }

    // Reject leave
    @PutMapping("/{id}/reject")
    public LeaveRequest rejectLeave(@PathVariable Long id) {
        return leaveService.rejectLeave(id);
    }

    // Cancel pending leave
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelLeave(@PathVariable Long id) {
        leaveService.cancelLeave(id);
    }
}
