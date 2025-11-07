# NewDragonResp

Запрос на аутентификацию

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [default to undefined]
**coordinates** | [**Coordinates**](Coordinates.md) |  | [default to undefined]
**cave** | [**DragonCave**](DragonCave.md) |  | [default to undefined]
**killer** | [**Person**](Person.md) |  | [optional] [default to undefined]
**age** | **number** |  | [optional] [default to undefined]
**description** | **string** |  | [default to undefined]
**wingspan** | **number** |  | [optional] [default to undefined]
**type** | **string** |  | [default to undefined]
**head** | [**DragonHead**](DragonHead.md) |  | [optional] [default to undefined]

## Example

```typescript
import { NewDragonResp } from './api';

const instance: NewDragonResp = {
    name,
    coordinates,
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
