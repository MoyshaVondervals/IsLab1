# CreateApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createCave**](#createcave) | **POST** /createCave | Создать пещеру|
|[**createCoordinates**](#createcoordinates) | **POST** /createCoordinates | Создать координаты|
|[**createHead**](#createhead) | **POST** /createHead | Создать голову дракона|
|[**createLocation**](#createlocation) | **POST** /createLocation | Создать локацию|
|[**createPerson**](#createperson) | **POST** /createPerson | Создать персонажа|

# **createCave**
> DragonCaveDTO createCave(dragonCaveDTO)

Создаёт пещеру и возвращает исходный DTO.

### Example

```typescript
import {
    CreateApi,
    Configuration,
    DragonCaveDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new CreateApi(configuration);

let dragonCaveDTO: DragonCaveDTO; //Пещера дракона

const { status, data } = await apiInstance.createCave(
    dragonCaveDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dragonCaveDTO** | **DragonCaveDTO**| Пещера дракона | |


### Return type

**DragonCaveDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Создано |  -  |
|**400** | Ошибка создания |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createCoordinates**
> CoordinatesDTO createCoordinates(coordinatesDTO)

Создаёт координаты и возвращает исходный DTO.

### Example

```typescript
import {
    CreateApi,
    Configuration,
    CoordinatesDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new CreateApi(configuration);

let coordinatesDTO: CoordinatesDTO; //Координаты

const { status, data } = await apiInstance.createCoordinates(
    coordinatesDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **coordinatesDTO** | **CoordinatesDTO**| Координаты | |


### Return type

**CoordinatesDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Создано |  -  |
|**400** | Ошибка создания |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createHead**
> DragonHeadDTO createHead(dragonHeadDTO)

Создаёт голову дракона и возвращает исходный DTO.

### Example

```typescript
import {
    CreateApi,
    Configuration,
    DragonHeadDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new CreateApi(configuration);

let dragonHeadDTO: DragonHeadDTO; //Голова дракона

const { status, data } = await apiInstance.createHead(
    dragonHeadDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dragonHeadDTO** | **DragonHeadDTO**| Голова дракона | |


### Return type

**DragonHeadDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Создано |  -  |
|**400** | Ошибка создания |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createLocation**
> LocationDTO createLocation(locationDTO)

Создаёт локацию и возвращает исходный DTO.

### Example

```typescript
import {
    CreateApi,
    Configuration,
    LocationDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new CreateApi(configuration);

let locationDTO: LocationDTO; //Локация

const { status, data } = await apiInstance.createLocation(
    locationDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **locationDTO** | **LocationDTO**| Локация | |


### Return type

**LocationDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Создано |  -  |
|**400** | Ошибка создания |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createPerson**
> PersonDTO createPerson(personDTO)

Создаёт персонажа. Если указана локация по id — будет привязана к персонажу.

### Example

```typescript
import {
    CreateApi,
    Configuration,
    PersonDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new CreateApi(configuration);

let personDTO: PersonDTO; //Персонаж

const { status, data } = await apiInstance.createPerson(
    personDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **personDTO** | **PersonDTO**| Персонаж | |


### Return type

**PersonDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Создано |  -  |
|**400** | Ошибка создания |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

