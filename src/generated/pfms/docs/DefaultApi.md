# DefaultApi

All URIs are relative to *https://pfms-sandbox.gov.in/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**initiateDbtPayment**](#initiatedbtpayment) | **POST** /payment | Initiate a DBT payment|

# **initiateDbtPayment**
> PaymentResponse initiateDbtPayment(paymentRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PaymentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let paymentRequest: PaymentRequest; //

const { status, data } = await apiInstance.initiateDbtPayment(
    paymentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **paymentRequest** | **PaymentRequest**|  | |


### Return type

**PaymentResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Payment initiated |  -  |
|**400** | Validation error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

