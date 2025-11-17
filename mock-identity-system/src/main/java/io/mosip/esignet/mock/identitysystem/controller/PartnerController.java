/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.controller;

import io.mosip.esignet.mock.identitysystem.dto.PartnerDto;
import io.mosip.esignet.mock.identitysystem.dto.RequestWrapper;
import io.mosip.esignet.mock.identitysystem.dto.ResponseWrapper;
import io.mosip.esignet.mock.identitysystem.service.PartnerService;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/")
public class PartnerController {

    @Autowired
    private PartnerService partnerService;

    @PostMapping(value = "partner", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = {
            MediaType.APPLICATION_JSON_VALUE })
    public ResponseWrapper<String> createUpdatePartner(@RequestBody @Valid RequestWrapper<PartnerDto> requestWrapper) {
        ResponseWrapper<String> response = new ResponseWrapper<String>();
        partnerService.upsertPartner(requestWrapper.getRequest());
        response.setResponse("Partner data created/updated successfully");
        response.setResponseTime(HelperUtil.getCurrentUTCDateTime());
        return response;
    }

}
