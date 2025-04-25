/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Data;

@Data
@Entity(name = "MockIdentity")
@Table(name = "mock_identity", schema = "mockidentitysystem")
public class MockIdentity {

	@Id
	@Column(name = "individual_id")
	private String individualId;
	
	@Column(name = "identity_json")
	private String identityJson;
	
}
