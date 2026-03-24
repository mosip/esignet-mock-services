// main.go
package main

import (
	"fmt"
	"net/http"
)

func main() {

	http.HandleFunc("/v1/otpmanager/otp/generate", func(w http.ResponseWriter, r *http.Request) {
		otp := 111111 // Generate a number between 100000 and 999999
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"response": {"otp": "%d"}}`, otp)
	})

	http.HandleFunc("/v1/auditmanager/audits", func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("audit endpoint invoked\n")
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status": "success"}`)
	})

	http.HandleFunc("/v1/notifier/sms/send", func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("Mock sending OTP\n")
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"response": {"status": "success"}}`)
	})

	http.HandleFunc("/auth/realms/mosip/protocol/openid-connect/token", func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("openid-connect/token invoked\n")
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"access_token": "test-access-token"}`)
	})

	http.HandleFunc("/masterdata/ui-spec", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"response": {"schema": [
            {
                "id": "email",
                "controlType": "textbox",
                "labelName": {
                    "en": "Email"
                },
                "placeholder": {
                    "eng": "Enter your email"
                },
                "validators": [],
                "required": false,
                "disabled": true,
                "prefix": [],
                "alignmentGroup": "groupA"
            },
            {
                "id": "fullName",
                "controlType": "textbox",
                "labelName": {
                    "en": "FullName"
                },
                "placeholder": {
                    "eng": "Enter your fullName"
                },
                "validators": [],
                "required": true,
                "prefix": [],
                "alignmentGroup": "groupAa"
            },
            {
                "id": "homeCountry",
                "controlType": "dropdown",
                "labelName": {
                    "eng": "Country"
                },
                "placeholder": {
                    "en": "Select Country"
                },
                "validators": [],
                "alignmentGroup": "groupH",
                "required": true,
				"subType" : "country"
            },
            {
                "id": "passportId",
                "controlType": "textbox",
                "labelName": {
                    "eng": "Passport ID"
                },
                "placeholder": {
                    "en": "Enter Passport ID"
                },
                "required": true,
                "alignmentGroup": "groupM"
            },
            {
                "id": "encodedPhoto",
                "controlType": "photo",
                "labelName": {
                    "eng": "Capture Photo",
                    "khm": "ថតរូប"
                },
                "placeholder": {
                    "eng": "Click to capture photo",
                    "khm": "ចុចដើម្បីថតរូប"
                },
                "info": {
                    "eng": "Please click here to capture your photo using your device's camera.",
                    "khm": "សូមចុចទីនេះដើម្បីថតរូបរបស់អ្នកដោយប្រើកាមេរ៉ារបស់ឧបករណ៍របស់អ្នក។"
                },
                "acceptedFileTypes": "image/jpeg , image/jpg , image/png , image/webp",
                "required": true,
                "alignmentGroup": "groupF"
            },
            {
                "id": "consent",
                "controlType": "checkbox",
                "labelName": {
                    "eng": "I agree to Veridonia’s <b><a href='#'>Terms & Conditions</a></b> and <b><a href='#'>Privacy Policy</a></b>, to store & process my information as required."
                },
                "required": true,
                "alignmentGroup": "groupO"
            }
        ],
        "allowedValues": {
			"country" : { "westalis" : { "eng" : "Westalis"}, "india" : { "eng" : "India"}, "morocco" : { "eng" : "Morocco"}}
		},
        "i18nValues": {
            "errors": {
                "required": {
                    "en": "This field is required"
                }
            },
            "labels": {
                "capturePhoto": {
                    "en": "Capture Photo",
                    "km": "ថតរូប"
                },
                "clickToUpload": {
                    "en": "Click to upload",
                    "km": "ចុចដើម្បីបញ្ចូលឬថតរូប"
                }
            },
            "placeholders": {
            }
        },
        "language": {
            "mandatory": [
                "eng",
				"fra"
            ],
            "optional": [],
            "langCodeMap": {
                "eng": "en",
				"fra":"fr"
            }
        },
        "maxUploadFileSize": 5242880
    }}`)
	})

	http.HandleFunc("/masterdata/identity-schema", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{
						"$schema": "https://json-schema.org/draft/2020-12/schema",
						"type": "object",
						"$defs": {
							"langField": {
							"type": "array",
							"items": {
								"type": "object",
								"properties": {
								"language": {
									"type": "string"
								},
								"value": {
									"type": "string"
								}
								},
								"required": [
								"language",
								"value"
								],
								"additionalProperties": false
							}
							}
						},
						"properties": {
							"individualId": {
							"type": "string"
							},
							"passportId": {
							"type": "string"
							},
                            "fullName": {
							"type": "string"
							},
							"consent": {
							"type": "boolean"
							},
							"homeCountry": {
							"type": "string"
							},
							"encodedPhoto": {
							"type": "string"
							}
						},
						"required": [
							"individualId",
                            "fullName",
							"homeCountry",
							"passportId",
							"email",
							"consent",
							"encodedPhoto"
						],
						"additionalProperties": true
						}`)
	})

	http.HandleFunc("/signup-identity-verifier-details.json", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `[
                            {
                                "id": "mock-identity-verifier",
                                "displayName": {
                                "eng": "Westalis NID Verifier",
                                "fra": "Vérificateur d'identité fictif",
                                "ara": "التحقق من الهوية الوهمية",
                                "khm": "Mock អត្តសញ្ញាណប័ណ្ណ Verifier"
                                },
                                "logoUrl": "https://avatars.githubusercontent.com/u/39733477?s=200&v=4",
                                "processType": "VIDEO",
                                "active": true,
                                "retryOnFailure": true
                            },
                            {
                                "id": "test-identity-verifier",
                                "displayName": {
                                "eng": "Westalis Tax ID Verifier (eidas)",
                                "fra": "Vérificateur d'identité fictif2",
                                "ara": "التحقق من الهوية الوهمية",
                                "khm": "Mock អត្តសញ្ញាណប័ណ្ណ Verifier2"
                                },
                                "logoUrl": "https://avatars.githubusercontent.com/u/39733477?s=200&v=4",
                                "processType": "VIDEO",
                                "active": true,
                                "retryOnFailure": true
                            }
                            ]`)
	})

	http.HandleFunc("/signup-idv_mock-identity-verifier.json", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{
                    "terms&Conditions": {
                        "eng": "I understand that the data collected about me during registration by the Bureau of Immigration, Veridonia includes different parameters."
                    },
                    "previewInfo": {
                        "step_1": {
                        "eng": "Verify the functionality of your camera using the video preview on the right"
                        },
                        "step_2": {
                        "eng": "Ensure you are positioned in a well-lit area to facilitate clear video capture"
                        },
                        "step_3": {
                        "eng": "Position your face within the oval frame, ensuring your face is clearly visible"
                        },
                        "step_4": {
                        "eng": "Remove any accessories or items that could obstruct your face, such as hats or sunglasses."
                        },
                        "step_5": {
                        "eng": "Maintain a stable posture throughout the video recording to prevent blurring"
                        },
                        "step_6": {
                        "eng": "Be prepared to follow instructions provided on screen during the eKYC process, such as blinking or turning your head as directed."
                        },
                        "step_7": {
                        "eng": "Have your ID readily accessible for the verification purposes."
                        }
                    },
                    "stepCodes": {
                        "liveness_check": {
                        "eng": "Starting Liveness check"
                        },
                        "id_verification": {
                        "eng": "ID card verification"
                        }
                    },
                    "errors": {
                        "low_light": {
                        "eng": "Low light, consider facing the sun or switching on the lights"
                        },
                        "id_card_too_far": {
                        "eng": "Unable to read card as its too far"
                        },
                        "invalid_frame": {
                        "eng": "The provided frames are not valid. Please check the input and try again."
                        },
                        "invalid_order": {
                        "eng": "The order provided is invalid. Please ensure the correct sequence and try again."
                        },
                        "invalid_step_code": {
                        "eng": "The step code is incorrect. Please verify the step and provide a valid code."
                        }
                    },
                    "messages": {
                        "turn_left": {
                        "eng": "Turn your head to Left"
                        },
                        "turn_right": {
                        "eng": "Turn your head to Right"
                        },
                        "sit_straight": {
                        "eng": "Keep good posture while facing the camera"
                        },
                        "success_check": {
                        "eng": "Liveness check successful"
                        },
                        "display_idcard": {
                        "eng": "Display your National ID card to the camera"
                        },
                        "id_verified": {
                        "eng": "Your National ID card verification successful"
                        },
                        "facingcamera": {
                        "eng": "Keep good posture while facing the camera,do follow all the instructions as informed"
                        },
                        "facingscreen": {
                        "eng": "please follow instruction to perform eKYC process successfully, keep your internet connected throughout the process"
                        },
                        "camera_on": {
                        "eng": "please follow instruction to perform eKYC process successfully, keep your internet connected throughout the process"
                        }
                    }
                    }`)
	})

	http.HandleFunc("/signup-idv_test-identity-verifier.json", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{
                    "terms&Conditions": {
                        "eng": "I understand that the data collected about me during registration by the Bureau of Immigration, Veridonia includes different parameters."
                    },
                    "previewInfo": {
                        "step_1": {
                        "eng": "Verify the functionality of your camera using the video preview on the right"
                        },
                        "step_2": {
                        "eng": "Ensure you are positioned in a well-lit area to facilitate clear video capture"
                        },
                        "step_3": {
                        "eng": "Position your face within the oval frame, ensuring your face is clearly visible"
                        },
                        "step_4": {
                        "eng": "Remove any accessories or items that could obstruct your face, such as hats or sunglasses."
                        },
                        "step_5": {
                        "eng": "Maintain a stable posture throughout the video recording to prevent blurring"
                        },
                        "step_6": {
                        "eng": "Be prepared to follow instructions provided on screen during the eKYC process, such as blinking or turning your head as directed."
                        },
                        "step_7": {
                        "eng": "Have your ID readily accessible for the verification purposes."
                        }
                    },
                    "stepCodes": {
                        "liveness_check": {
                        "eng": "Starting Liveness check"
                        },
                        "id_verification": {
                        "eng": "ID card verification"
                        }
                    },
                    "errors": {
                        "low_light": {
                        "eng": "Low light, consider facing the sun or switching on the lights"
                        },
                        "id_card_too_far": {
                        "eng": "Unable to read card as its too far"
                        },
                        "invalid_frame": {
                        "eng": "The provided frames are not valid. Please check the input and try again."
                        },
                        "invalid_order": {
                        "eng": "The order provided is invalid. Please ensure the correct sequence and try again."
                        },
                        "invalid_step_code": {
                        "eng": "The step code is incorrect. Please verify the step and provide a valid code."
                        }
                    },
                    "messages": {
                        "turn_left": {
                        "eng": "Turn your head to Left"
                        },
                        "turn_right": {
                        "eng": "Turn your head to Right"
                        },
                        "sit_straight": {
                        "eng": "Keep good posture while facing the camera"
                        },
                        "success_check": {
                        "eng": "Liveness check successful"
                        },
                        "id_verified": {
                        "eng": "Your Tax ID card verification successful"
                        },
                        "facingcamera": {
                        "eng": "Keep good posture while facing the camera,do follow all the instructions as informed"
                        },
                        "facingscreen": {
                        "eng": "please follow instruction to perform verification process successfully, keep your internet connected throughout the process"
                        },
                        "camera_on": {
                        "eng": "please follow instruction to perform eKYC process successfully, keep your internet connected throughout the process"
                        },
                        "display_idcard": {
                        "eng": "Display your Westalis Tax ID card to the camera"
                        }
                    }
                    }`)
	})

	http.HandleFunc("/identity_verifier_story.json", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"scenes":[
                                {"frameNumber" : 0, "stepCode" : "START", "step" : { "code" : "liveness_check", "framesPerSecond" : 1, "durationInSeconds" : 100, "startupDelayInSeconds" : 2, "retryOnTimeout" : false, "retryableErrorCodes" : [] }, "feedback" : null },
                                {"frameNumber" : 1, "stepCode" : "liveness_check", "step" : null, "feedback" : {"type" : "MESSAGE", "code" : "turn_left" } },
                                {"frameNumber" : 2, "stepCode" : "liveness_check", "step" : null, "feedback" : {"type" : "MESSAGE", "code" : "turn_right" } },
                                {"frameNumber" : 3, "stepCode" : "liveness_check", "step" : null, "feedback" : {"type" : "MESSAGE", "code" : "success_check" } },
                                {"frameNumber" : 4, "stepCode" : "liveness_check", "step" : null, "feedback" : {"type" : "MESSAGE", "code" : "display_idcard" } },
                                {"frameNumber" : 5, "stepCode" : "liveness_check", "step" : null, "feedback" : {"type" : "MESSAGE", "code" : "id_verified" } },
                                {"frameNumber" : 6, "stepCode" : "liveness_check", "step" : { "code" : "END", "framesPerSecond" : 0, "durationInSeconds" : 0, "startupDelayInSeconds" : 0, "retryOnTimeout" : false, "retryableErrorCodes" : [] }, "feedback" : null }
                            ],
                            "verificationResult": {
                                "status": "COMPLETED",
                                "verifiedClaims" : { "email" : { "trust_framework":"NID", "verification_process":"online_video", "assurance_level": "Gold" },
                                "homeCountry" : { "trust_framework":"NID", "verification_process":"online_video", "assurance_level": "Gold" }},
                                "errorCode": null
                            }
                            }`)
	})

	http.HandleFunc("/test_verifier_story.json", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"scenes":[
                                {"frameNumber" : 0, "stepCode" : "START", "step" : { "code" : "liveness_check", "framesPerSecond" : 1, "durationInSeconds" : 100, "startupDelayInSeconds" : 2, "retryOnTimeout" : false, "retryableErrorCodes" : [] }, "feedback" : null },
                                {"frameNumber" : 1, "stepCode" : "liveness_check", "step" : null, "feedback" : {"type" : "MESSAGE", "code" : "facingscreen" } },
                                {"frameNumber" : 2, "stepCode" : "liveness_check", "step" : null, "feedback" : {"type" : "MESSAGE", "code" : "turn_left" } },
                                {"frameNumber" : 3, "stepCode" : "liveness_check", "step" : null, "feedback" : {"type" : "MESSAGE", "code" : "success_check" } },
                                {"frameNumber" : 4, "stepCode" : "liveness_check", "step" : null, "feedback" : {"type" : "MESSAGE", "code" : "display_idcard" } },
                                {"frameNumber" : 5, "stepCode" : "liveness_check", "step" : null, "feedback" : {"type" : "MESSAGE", "code" : "id_verified" } },
                                {"frameNumber" : 6, "stepCode" : "liveness_check", "step" : { "code" : "END", "framesPerSecond" : 0, "durationInSeconds" : 0, "startupDelayInSeconds" : 0, "retryOnTimeout" : false, "retryableErrorCodes" : [] }, "feedback" : null }
                            ],
                            "verificationResult": {
                                "status": "COMPLETED",
                                "verifiedClaims" : { "fullName" : { "trust_framework":"eidas", "verification_process":"online_video", "assurance_level": "Gold" },
                                "passportId" : { "trust_framework":"eidas", "verification_process":"online_video", "assurance_level": "Gold" }},
                                "errorCode": null
                            }
                            }`)
	})

	fmt.Println("Server starting on port 8080...")
	http.ListenAndServe(":8080", nil)
}
