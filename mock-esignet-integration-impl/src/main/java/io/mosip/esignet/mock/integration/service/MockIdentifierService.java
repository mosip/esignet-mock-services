package io.mosip.esignet.mock.integration.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.esignet.mock.integration.dto.Feedback;
import io.mosip.esignet.mock.integration.dto.MockIdentifierResponse;
import io.mosip.esignet.mock.integration.dto.Step;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class MockIdentifierService {

    @Autowired
    private ObjectMapper objectMapper;

    Map<String, int[]> map = new HashMap<>();

    private List<Map<String, Object>> getMappingJson(){
        try {
            Path filePath = Paths.get("");
            String userFlowConfigTxt = Files.readString(filePath);
            try {
                Map<String, Object> root = objectMapper.readValue(userFlowConfigTxt, new TypeReference<Map<String, Object>>() {});
                return (List<Map<String, Object>>) root.get("userflow");
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Invalid userFlowConfigJson: " + e.getMessage());
            }
        } catch (IOException e) {
            throw new RuntimeException("Invalid userFlowConfigJson: " + e.getMessage());
        }
    }

    private Map<String, Object> getProcessJson(){
        try {
            Path filePath = Paths.get("");
            String userFlowConfigTxt = Files.readString(filePath);
            try {
                return objectMapper.readValue(userFlowConfigTxt, new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Invalid processJson: " + e.getMessage());
            }
        } catch (IOException e) {
            throw new RuntimeException("Invalid processJson: " + e.getMessage());
        }
    }

    public MockIdentifierResponse processFrames(String slotId, String stepId, int attempt, String[] capturedFrames) {
        int[] data = map.getOrDefault(slotId, new int[2]);
        int maxAttempts = 3;
        List<Map<String, Object>> userFlow = getMappingJson();
        Map<String,Object> process=getProcessJson();
        int id = data[0];
        Map<String, Object> desiredStep = getStepById(String.valueOf(id), userFlow,slotId);
        if (attempt <= maxAttempts) {
            int reqFrameCount = 0;
            if (!desiredStep.isEmpty()) {
                reqFrameCount = (int) desiredStep.get("framesToConsume");
            }
            if (capturedFrames.length + data[1] < reqFrameCount) {
                data[1] += capturedFrames.length;
                map.put(slotId,data);
            } else {
                data[0] += 1;
                data[1] = 0;
                map.put(slotId, data);
                int nextId = 1;
                if(!desiredStep.isEmpty()) {
                    nextId = Integer.parseInt(String.valueOf(desiredStep.get("id"))) + 1;
                }
                Map<String, Object> nextStep = getStepById(String.valueOf(nextId), userFlow,slotId);
                Feedback feedback = new Feedback();
                if (nextStep.containsKey("feedback")) {
                    Map<String, Object> feedbackConfig = (Map<String, Object>) nextStep.get("feedback");
                    if (feedbackConfig != null) {
                        String type = (String) feedbackConfig.get("type");
                        String code = (String) feedbackConfig.get("code");
                        feedback.setType(type);
                        feedback.setCode(code);
                    }
                    Step stepResponse = new Step();
                    if (stepId.equals("liveness_check")) {
                        Map<String, Object> process1 = (Map<String, Object>) process.get("process");
                        Map<String, Object> livenessCheckProcess= (Map<String, Object>) process1.get("liveness_check");
                        stepResponse.setCode(String.valueOf(livenessCheckProcess.get("code")));
                        stepResponse.setFramesPerSecond(Integer.parseInt(String.valueOf(livenessCheckProcess.get("framesPerSecond"))));
                        stepResponse.setDurationInSeconds(Integer.parseInt(String.valueOf(livenessCheckProcess.get("duration"))));
                        stepResponse.setStartupDelayInSeconds(Integer.parseInt(String.valueOf(livenessCheckProcess.get("startupDelay"))));
                        stepResponse.setRetryOnTimeout(Boolean.parseBoolean(String.valueOf(livenessCheckProcess.get("retryOnTime"))));
                        stepResponse.setRetryOnError(Arrays.asList("err-code1", "err-code2"));
                    } else if (stepId.equals("idcard_check")) {
                        Map<String, Object> process1 = (Map<String, Object>) process.get("process");
                        Map<String, Object> idCardCheckProcess = (Map<String, Object>) process1.get("idcard_check");
                        stepResponse.setCode(String.valueOf(idCardCheckProcess.get("code")));
                        stepResponse.setFramesPerSecond(Integer.parseInt(String.valueOf(idCardCheckProcess.get("framesPerSecond"))));
                        stepResponse.setDurationInSeconds(Integer.parseInt(String.valueOf(idCardCheckProcess.get("duration"))));
                        stepResponse.setStartupDelayInSeconds(Integer.parseInt(String.valueOf(idCardCheckProcess.get("startupDelay"))));
                        stepResponse.setRetryOnTimeout(Boolean.parseBoolean(String.valueOf(idCardCheckProcess.get("retryOnTime"))));
                        stepResponse.setRetryOnError(Arrays.asList("err-code1", "err-code2"));
                    } else {
                        throw new RuntimeException("Invalid StepId");
                    }

                    MockIdentifierResponse response = new MockIdentifierResponse();
                    response.setStep(stepResponse);
                    response.setFeedback(feedback);
                    return response;
                }
            }
        }
        return null;
    }

    private Map<String, Object> getStepById(String id, List<Map<String, Object>> userflow,String slotId) {
        for (Map<String, Object> step : userflow) {
            if (step.get("id").equals(id)) {
                return step;
            }
        }
        map.put(slotId,new int[]{0,0});
        return new HashMap<>();
    }

}
