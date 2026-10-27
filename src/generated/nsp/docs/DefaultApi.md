# DefaultApi

All URIs are relative to *https://nsp-sandbox.gov.in/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**checkScholarshipEligibility**](#checkscholarshipeligibility) | **POST** /eligibility | Check scholarship eligibility for a student|

# **checkScholarshipEligibility**
> EligibilityResponse checkScholarshipEligibility(eligibilityRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    EligibilityRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let eligibilityRequest: EligibilityRequest; //

const { status, data } = await apiInstance.checkScholarshipEligibility(
    eligibilityRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eligibilityRequest** | **EligibilityRequest**|  | |


### Return type

**EligibilityResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Eligibility result |  -  |
|**400** | Bad request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

