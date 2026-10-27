# DefaultApi

All URIs are relative to *https://edistrict-sandbox.gov.in/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getBeneficiary**](#getbeneficiary) | **GET** /beneficiary/{aadhaar} | Fetch beneficiary details by Aadhaar|

# **getBeneficiary**
> BeneficiaryResponse getBeneficiary()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let aadhaar: string; // (default to undefined)

const { status, data } = await apiInstance.getBeneficiary(
    aadhaar
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **aadhaar** | [**string**] |  | defaults to undefined|


### Return type

**BeneficiaryResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Beneficiary record |  -  |
|**404** | Not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

