# SpecialApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAvgAge**](#getavgage) | **GET** /dragons/avgAge | Средний возраст драконов|
|[**getDragonHeadGreater**](#getdragonheadgreater) | **GET** /dragons/headGreater/{param} | Дракон с головой больше параметра|
|[**getDragonWithMaxCave**](#getdragonwithmaxcave) | **GET** /dragons/maxCave | Дракон с максимальной пещерой|
|[**getOldestDragon**](#getoldestdragon) | **GET** /dragons/oldest | Самый старый дракон|
|[**killDragon**](#killdragon) | **POST** /dragons/kill | Убить дракона|

# **getAvgAge**
> number getAvgAge()


### Example

```typescript
import {
    SpecialApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SpecialApi(configuration);

const { status, data } = await apiInstance.getAvgAge();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**number**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDragonHeadGreater**
> DragonDTO getDragonHeadGreater()

Ищет дракона, у которого размер головы больше указанного параметра.

### Example

```typescript
import {
    SpecialApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SpecialApi(configuration);

let param: number; //Пороговое значение для размера головы (default to undefined)

const { status, data } = await apiInstance.getDragonHeadGreater(
    param
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **param** | [**number**] | Пороговое значение для размера головы | defaults to undefined|


### Return type

**DragonDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDragonWithMaxCave**
> DragonDTO getDragonWithMaxCave()


### Example

```typescript
import {
    SpecialApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SpecialApi(configuration);

const { status, data } = await apiInstance.getDragonWithMaxCave();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**DragonDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOldestDragon**
> DragonDTO getOldestDragon()


### Example

```typescript
import {
    SpecialApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SpecialApi(configuration);

const { status, data } = await apiInstance.getOldestDragon();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**DragonDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **killDragon**
> Dragon killDragon(killDragonDTO)

Отмечает дракона как убитого, связывая с указанным убийцей. 404 — если дракон/убийца не найдены, 409 — если уже убит.

### Example

```typescript
import {
    SpecialApi,
    Configuration,
    KillDragonDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new SpecialApi(configuration);

let killDragonDTO: KillDragonDTO; //ID дракона и убийцы

const { status, data } = await apiInstance.killDragon(
    killDragonDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **killDragonDTO** | **KillDragonDTO**| ID дракона и убийцы | |


### Return type

**Dragon**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | Не найдено |  -  |
|**409** | Конфликт состояния |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

