# DefaultApi

All URIs are relative to *https://digilocker-sandbox.gov.in/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**fetchDocument**](#fetchdocument) | **GET** /document/{docId} | Retrieve a stored document (PDF / image) as base64|

# **fetchDocument**
> DocumentResponse fetchDocument()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let docId: string; // (default to undefined)

const { status, data } = await apiInstance.fetchDocument(
    docId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **docId** | [**string**] |  | defaults to undefined|


### Return type

**DocumentResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Document payload |  -  |
|**404** | Document not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

