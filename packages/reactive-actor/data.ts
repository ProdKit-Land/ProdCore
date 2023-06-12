// Everything related to data
// https://developer.mozilla.org/en-US/docs/Web/API/Attr

//------------------------------------
// trustedTypes 
//------------------------------------
const trustedTypes = (globalThis as { trustedTypes?: { emptyScript: '' } }).trustedTypes;
const emptyStringForBooleanAttribute = trustedTypes
  ? trustedTypes.emptyScript as string
  : '';

//------------------------------------
// attribute 
//------------------------------------
export type AttributeConverter<Type = unknown, TypeHint = unknown> =
  | {
      toAttribute?(value: Type, type?: TypeHint): unknown;
      fromAttribute?(value: string | null, type?: TypeHint): Type;
    }
  | ((value: string | null, type?: TypeHint) => Type); 

export const defaultConverter: AttributeConverter = {
  toAttribute(value: unknown, type?: unknown): string | null {

    let toValue: unknown = value;

    if (value === null || value === undefined ||  value === '') {
      return null;
    }

    switch (type) {
      case Boolean:
        toValue = value ? emptyStringForBooleanAttribute : null;
        break;
      case Number:
      case BigInt:
      case Symbol:
      case Function:
        toValue = value.toString();
        break;
      case Object:
      case Array:
      case Map:
      case Set:
        toValue = JSON.stringify(value);
        break;
      // case Date:
      //   toValue = (value as Date).toISOString();
      //   break;
      default:
        throw new Error(`Can not convert type "${type}" and value "${value}" to attribute`);
    }
    return String(toValue);
  },
  fromAttribute(value: string | null, type?: unknown): unknown {

    let fromValue: unknown = value;

    if (value === null || value === undefined ||  value === '') {
      return null;
    }
    switch (type) {
      case Boolean: 
      fromValue = value !== null;
      break;
      case Number:
        fromValue = Number(value);
        break;
      case Object:
      case Array:
      case Map:
      case Set:
        fromValue = JSON.stringify(value);
        break;
      // case Date:
      //   fromValue = new Date(value);
      //   break;
      default:
        throw new Error(`Can not convert type "${type}" and value "${value}" from attribute`);
    }
    return String(fromValue); 
  },
}

//------------------------------------
// property 
//------------------------------------
export interface PropertyValidator<Type> { (value: Type): boolean; }
export interface PropertySanitizer<Type> { (value: unknown): unknown; }
export interface PropertySerializer<Type> { (value: Type): unknown; }
export interface PropertyDeserializer<Type> { (value: unknown): Type; }

export interface PropertyOption<Type = unknown, TypeHint = unknown> {
  readonly name: PropertyKey;
  readonly type: TypeHint;
  readonly converter?: AttributeConverter<Type, TypeHint>;
  readonly state?: boolean | string;
  readonly attribute?: boolean | string;
  readonly default?:  boolean | string;
  readonly reflect?: boolean;
  readonly validate?: PropertyValidator<Type>;
  readonly sanitize?: PropertySanitizer<Type>;
  readonly serialize?: PropertySerializer<Type>;
  readonly deserialize?: PropertyDeserializer<Type>;
}

export type PropertyValues<Type = unknown> = Type extends object ? Map<PropertyKey, unknown> : never;
