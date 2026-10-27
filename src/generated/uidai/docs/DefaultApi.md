# DefaultApi

All URIs are relative to *https://uidai-sandbox.gov.in/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**verifyAadhaarOtp**](#verifyaadhaarotp) | **POST** /otp/verify | Verify Aadhaar OTP|

# **verifyAadhaarOtp**
> AadhaarOtpResponse verifyAadhaarOtp(aadhaarOtpRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    AadhaarOtpRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let aadhaarOtpRequest: AadhaarOtpRequest; //

const { status, data } = await apiInstance.verifyAadhaarOtp(
    aadhaarOtpRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **aadhaarOtpRequest** | **AadhaarOtpRequest**|  | |


### Return type

**AadhaarOtpResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Success |  -  |
|**400** | Validation error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

