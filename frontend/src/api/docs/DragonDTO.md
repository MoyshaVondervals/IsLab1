# DragonDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [default to undefined]
**coordinates** | [**CoordinatesDTO**](CoordinatesDTO.md) |  | [default to undefined]
**creationDate** | **string** |  | [default to undefined]
**cave** | [**DragonCaveDTO**](DragonCaveDTO.md) |  | [default to undefined]
**killer** | [**PersonDTO**](PersonDTO.md) |  | [optional] [default to undefined]
**age** | **number** |  | [optional] [default to undefined]
**description** | **string** |  | [default to undefined]
**wingspan** | **number** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**head** | [**DragonHeadDTO**](DragonHeadDTO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { DragonDTO } from './api';

const instance: DragonDTO = {
    id,
    name,
    coordinates,
    creationDate,
    cave,
    killer,
    age,
    description,
    wingspan,
    type,
    head,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
