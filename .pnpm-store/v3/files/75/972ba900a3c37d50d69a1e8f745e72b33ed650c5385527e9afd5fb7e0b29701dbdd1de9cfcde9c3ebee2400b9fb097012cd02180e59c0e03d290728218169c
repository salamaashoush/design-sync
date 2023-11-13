/**
 * Issue reason type.
 */
type IssueReason = 'any' | 'array' | 'bigint' | 'blob' | 'boolean' | 'date' | 'function' | 'instance' | 'map' | 'number' | 'object' | 'record' | 'set' | 'special' | 'string' | 'symbol' | 'tuple' | 'undefined' | 'unknown' | 'type';
/**
 * Issue origin type.
 */
type IssueOrigin = 'key' | 'value';
/**
 * Issue type.
 */
type Issue = {
    reason: IssueReason;
    validation: string;
    origin: IssueOrigin;
    message: string;
    input: any;
    path?: PathItem[];
    issues?: Issues;
    abortEarly?: boolean;
    abortPipeEarly?: boolean;
    skipPipe?: boolean;
};
/**
 * Issues type.
 */
type Issues = [Issue, ...Issue[]];
/**
 * Parse info type.
 */
type ParseInfo = Partial<Pick<Issue, 'origin' | 'abortEarly' | 'abortPipeEarly' | 'skipPipe'>>;
/**
 * Path item type.
 */
type PathItem = ObjectPathItem | RecordPathItem | TuplePathItem | MapPathItem | SetPathItem | ArrayPathItem;
/**
 * Parse result type.
 */
type _ParseResult<TOutput> = {
    output: TOutput;
    issues?: undefined;
} | {
    output?: undefined;
    issues: Issues;
};
/**
 * Base schema type.
 */
type BaseSchema<TInput = any, TOutput = TInput> = {
    async: false;
    _parse(input: unknown, info?: ParseInfo): _ParseResult<TOutput>;
    _types?: {
        input: TInput;
        output: TOutput;
    };
};
/**
 * Base schema async type.
 */
type BaseSchemaAsync<TInput = any, TOutput = TInput> = {
    async: true;
    _parse(input: unknown, info?: ParseInfo): Promise<_ParseResult<TOutput>>;
    _types?: {
        input: TInput;
        output: TOutput;
    };
};
/**
 * Input inference type.
 */
type Input<TSchema extends BaseSchema | BaseSchemaAsync> = NonNullable<TSchema['_types']>['input'];
/**
 * Output inference type.
 */
type Output<TSchema extends BaseSchema | BaseSchemaAsync> = NonNullable<TSchema['_types']>['output'];
/**
 * Error message type.
 */
type ErrorMessage = string | (() => string);
/**
 * Pipe info type.
 */
type PipeInfo = ParseInfo & Pick<Issue, 'reason'>;
/**
 * Pipe result type.
 */
type PipeResult<TOutput> = {
    output: TOutput;
    issues?: undefined;
} | {
    output?: undefined;
    issues: Pick<Issue, 'validation' | 'message' | 'input' | 'path'>[];
};
/**
 * Validation and transformation pipe type.
 */
type Pipe<TValue> = ((value: TValue) => PipeResult<TValue>)[];
/**
 * Async validation and transformation pipe type.
 */
type PipeAsync<TValue> = ((value: TValue) => PipeResult<TValue> | Promise<PipeResult<TValue>>)[];
/**
 * Resolve type.
 *
 * Hint: This type has no effect and is only used so that TypeScript displays
 * the final type in the preview instead of the utility types used.
 */
type Resolve<T> = T;
/**
 * Resolve object type.
 *
 * Hint: This type has no effect and is only used so that TypeScript displays
 * the final type in the preview instead of the utility types used.
 */
type ResolveObject<T> = Resolve<{
    [k in keyof T]: T[k];
}>;

/**
 * Any schema type.
 */
type AnySchema<TOutput = any> = BaseSchema<any, TOutput> & {
    type: 'any';
};
/**
 * Creates a any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A any schema.
 */
declare function any(pipe?: Pipe<any>): AnySchema;

/**
 * Any schema type.
 */
type AnySchemaAsync<TOutput = any> = BaseSchemaAsync<any, TOutput> & {
    type: 'any';
};
/**
 * Creates an async any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async any schema.
 */
declare function anyAsync(pipe?: PipeAsync<any>): AnySchemaAsync;

/**
 * Array schema type.
 */
type ArraySchema<TItem extends BaseSchema, TOutput = Output<TItem>[]> = BaseSchema<Input<TItem>[], TOutput> & {
    type: 'array';
    item: TItem;
};
/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A array schema.
 */
declare function array<TItem extends BaseSchema>(item: TItem, pipe?: Pipe<Output<TItem>[]>): ArraySchema<TItem>;
/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A array schema.
 */
declare function array<TItem extends BaseSchema>(item: TItem, error?: ErrorMessage, pipe?: Pipe<Output<TItem>[]>): ArraySchema<TItem>;

/**
 * Array schema async type.
 */
type ArraySchemaAsync<TItem extends BaseSchema | BaseSchemaAsync, TOutput = Output<TItem>[]> = BaseSchemaAsync<Input<TItem>[], TOutput> & {
    type: 'array';
    item: TItem;
};
/**
 * Creates an async array schema.
 *
 * @param item The item schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async array schema.
 */
declare function arrayAsync<TItem extends BaseSchema | BaseSchemaAsync>(item: TItem, pipe?: PipeAsync<Output<TItem>[]>): ArraySchemaAsync<TItem>;
/**
 * Creates an async array schema.
 *
 * @param item The item schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async array schema.
 */
declare function arrayAsync<TItem extends BaseSchema | BaseSchemaAsync>(item: TItem, error?: ErrorMessage, pipe?: PipeAsync<Output<TItem>[]>): ArraySchemaAsync<TItem>;

/**
 * Array path item type.
 */
type ArrayPathItem = {
    type: 'array';
    input: any[];
    key: number;
    value: any;
};

/**
 * Bigint schema type.
 */
type BigintSchema<TOutput = bigint> = BaseSchema<bigint, TOutput> & {
    type: 'bigint';
};
/**
 * Creates a bigint schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A bigint schema.
 */
declare function bigint(pipe?: Pipe<bigint>): BigintSchema;
/**
 * Creates a bigint schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A bigint schema.
 */
declare function bigint(error?: ErrorMessage, pipe?: Pipe<bigint>): BigintSchema;

/**
 * Bigint schema async type.
 */
type BigintSchemaAsync<TOutput = bigint> = BaseSchemaAsync<bigint, TOutput> & {
    type: 'bigint';
};
/**
 * Creates an async bigint schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async bigint schema.
 */
declare function bigintAsync(pipe?: PipeAsync<bigint>): BigintSchemaAsync;
/**
 * Creates an async bigint schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async bigint schema.
 */
declare function bigintAsync(error?: ErrorMessage, pipe?: PipeAsync<bigint>): BigintSchemaAsync;

/**
 * Blob schema type.
 */
type BlobSchema<TOutput = Blob> = BaseSchema<Blob, TOutput> & {
    type: 'blob';
};
/**
 * Creates a blob schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A blob schema.
 */
declare function blob(pipe?: Pipe<Blob>): BlobSchema;
/**
 * Creates a blob schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A blob schema.
 */
declare function blob(error?: ErrorMessage, pipe?: Pipe<Blob>): BlobSchema;

/**
 * Blob schema async type.
 */
type BlobSchemaAsync<TOutput = Blob> = BaseSchemaAsync<Blob, TOutput> & {
    type: 'blob';
};
/**
 * Creates an async blob schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async blob schema.
 */
declare function blobAsync(pipe?: PipeAsync<Blob>): BlobSchemaAsync;
/**
 * Creates an async blob schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async blob schema.
 */
declare function blobAsync(error?: ErrorMessage, pipe?: PipeAsync<Blob>): BlobSchemaAsync;

/**
 * Boolean schema type.
 */
type BooleanSchema<TOutput = boolean> = BaseSchema<boolean, TOutput> & {
    type: 'boolean';
};
/**
 * Creates a boolean schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A boolean schema.
 */
declare function boolean(pipe?: Pipe<boolean>): BooleanSchema;
/**
 * Creates a boolean schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A boolean schema.
 */
declare function boolean(error?: ErrorMessage, pipe?: Pipe<boolean>): BooleanSchema;

/**
 * Boolean schema async type.
 */
type BooleanSchemaAsync<TOutput = boolean> = BaseSchemaAsync<boolean, TOutput> & {
    type: 'boolean';
};
/**
 * Creates an async boolean schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async boolean schema.
 */
declare function booleanAsync(pipe?: PipeAsync<boolean>): BooleanSchemaAsync;
/**
 * Creates an async boolean schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async boolean schema.
 */
declare function booleanAsync(error?: ErrorMessage, pipe?: PipeAsync<boolean>): BooleanSchemaAsync;

/**
 * Date schema type.
 */
type DateSchema<TOutput = Date> = BaseSchema<Date, TOutput> & {
    type: 'date';
};
/**
 * Creates a date schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A date schema.
 */
declare function date(pipe?: Pipe<Date>): DateSchema;
/**
 * Creates a date schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A date schema.
 */
declare function date(error?: ErrorMessage, pipe?: Pipe<Date>): DateSchema;

/**
 * Date schema async type.
 */
type DateSchemaAsync<TOutput = Date> = BaseSchemaAsync<Date, TOutput> & {
    type: 'date';
};
/**
 * Creates an async date schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async date schema.
 */
declare function dateAsync(pipe?: PipeAsync<Date>): DateSchemaAsync;
/**
 * Creates an async date schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async date schema.
 */
declare function dateAsync(error?: ErrorMessage, pipe?: PipeAsync<Date>): DateSchemaAsync;

/**
 * Enum type.
 */
type Enum = {
    [key: string]: string | number;
    [key: number]: string;
};
/**
 * Native enum schema type.
 */
type EnumSchema<TEnum extends Enum, TOutput = TEnum[keyof TEnum]> = BaseSchema<TEnum[keyof TEnum], TOutput> & {
    type: 'enum';
    enum: TEnum;
};
/**
 * Creates a enum schema.
 *
 * @param enum_ The enum value.
 * @param error The error message.
 *
 * @returns A enum schema.
 */
declare function enum_<TEnum extends Enum>(enum_: TEnum, error?: ErrorMessage): EnumSchema<TEnum>;
/**
 * See {@link enum_}
 *
 * @deprecated Use `enum_` instead.
 */
declare const nativeEnum: typeof enum_;

/**
 * Native enum schema async type.
 */
type EnumSchemaAsync<TEnum extends Enum, TOutput = TEnum[keyof TEnum]> = BaseSchemaAsync<TEnum[keyof TEnum], TOutput> & {
    type: 'enum';
    enum: TEnum;
};
/**
 * Creates an async enum schema.
 *
 * @param enum_ The enum value.
 * @param error The error message.
 *
 * @returns An async enum schema.
 */
declare function enumAsync<TEnum extends Enum>(enum_: TEnum, error?: ErrorMessage): EnumSchemaAsync<TEnum>;
/**
 * See {@link enumAsync}
 *
 * @deprecated Use `enumAsync` instead.
 */
declare const nativeEnumAsync: typeof enumAsync;

/**
 * Class enum type.
 */
type Class = abstract new (...args: any) => any;
/**
 * Instance schema type.
 */
type InstanceSchema<TClass extends Class, TOutput = InstanceType<TClass>> = BaseSchema<InstanceType<TClass>, TOutput> & {
    type: 'instance';
    class: TClass;
};
/**
 * Creates an instance schema.
 *
 * @param of The class of the instance.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An instance schema.
 */
declare function instance<TClass extends Class>(of: TClass, pipe?: Pipe<InstanceType<TClass>>): InstanceSchema<TClass>;
/**
 * Creates an instance schema.
 *
 * @param of The class of the instance.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An instance schema.
 */
declare function instance<TClass extends Class>(of: TClass, error?: ErrorMessage, pipe?: Pipe<InstanceType<TClass>>): InstanceSchema<TClass>;

/**
 * Instance schema type.
 */
type InstanceSchemaAsync<TClass extends Class, TOutput = InstanceType<TClass>> = BaseSchemaAsync<InstanceType<TClass>, TOutput> & {
    type: 'instance';
    class: TClass;
};
/**
 * Creates an async instance schema.
 *
 * @param of The class of the instance.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async instance schema.
 */
declare function instanceAsync<TClass extends Class>(of: TClass, pipe?: PipeAsync<InstanceType<TClass>>): InstanceSchemaAsync<TClass>;
/**
 * Creates an async instance schema.
 *
 * @param of The class of the instance.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async instance schema.
 */
declare function instanceAsync<TClass extends Class>(of: TClass, error?: ErrorMessage, pipe?: PipeAsync<InstanceType<TClass>>): InstanceSchemaAsync<TClass>;

/**
 * Intersect options async type.
 */
type IntersectOptionsAsync = [
    BaseSchema | BaseSchemaAsync,
    BaseSchema | BaseSchemaAsync,
    ...(BaseSchema[] | BaseSchemaAsync[])
];

/**
 * Intersect input type.
 */
type IntersectInput<TIntersectOptions extends IntersectOptions | IntersectOptionsAsync> = TIntersectOptions extends [
    BaseSchema<infer TInput1, any> | BaseSchemaAsync<infer TInput1, any>,
    ...infer TRest
] ? TRest extends IntersectOptions ? TInput1 & IntersectOutput<TRest> : TRest extends [
    BaseSchema<infer TInput2, any> | BaseSchemaAsync<infer TInput2, any>
] ? TInput1 & TInput2 : never : never;
/**
 * Intersect output type.
 */
type IntersectOutput<TIntersectOptions extends IntersectOptions | IntersectOptionsAsync> = TIntersectOptions extends [
    BaseSchema<any, infer TOutput1> | BaseSchemaAsync<any, infer TOutput1>,
    ...infer TRest
] ? TRest extends IntersectOptions ? TOutput1 & IntersectOutput<TRest> : TRest extends [
    BaseSchema<any, infer TOutput2> | BaseSchemaAsync<any, infer TOutput2>
] ? TOutput1 & TOutput2 : never : never;

/**
 * Intersect options type.
 */
type IntersectOptions = [BaseSchema, BaseSchema, ...BaseSchema[]];
/**
 * Intersect schema type.
 */
type IntersectSchema<TOptions extends IntersectOptions, TOutput = IntersectOutput<TOptions>> = BaseSchema<IntersectInput<TOptions>, TOutput> & {
    type: 'intersect';
    options: TOptions;
};
/**
 * Creates an intersect schema.
 *
 * @param options The intersect options.
 * @param error The error message.
 *
 * @returns An intersect schema.
 */
declare function intersect<TOptions extends IntersectOptions>(options: TOptions, error?: string): IntersectSchema<TOptions>;
/**
 * See {@link intersect}
 *
 * @deprecated Use `intersect` instead.
 */
declare const intersection: typeof intersect;

/**
 * Literal type.
 */
type Literal = number | string | boolean | symbol | bigint;

/**
 * Literal schema type.
 */
type LiteralSchema<TLiteral extends Literal, TOutput = TLiteral> = BaseSchema<TLiteral, TOutput> & {
    type: 'literal';
    literal: TLiteral;
};
/**
 * Creates a literal schema.
 *
 * @param literal The literal value.
 * @param error The error message.
 *
 * @returns A literal schema.
 */
declare function literal<TLiteral extends Literal>(literal: TLiteral, error?: ErrorMessage): LiteralSchema<TLiteral>;

/**
 * Literal schema async type.
 */
type LiteralSchemaAsync<TLiteral extends Literal, TOutput = TLiteral> = BaseSchemaAsync<TLiteral, TOutput> & {
    type: 'literal';
    literal: TLiteral;
};
/**
 * Creates an async literal schema.
 *
 * @param literal The literal value.
 * @param error The error message.
 *
 * @returns An async literal schema.
 */
declare function literalAsync<TLiteral extends Literal>(literal: TLiteral, error?: ErrorMessage): LiteralSchemaAsync<TLiteral>;

/**
 * Map path item type.
 */
type MapPathItem = {
    type: 'map';
    input: Map<any, any>;
    key: any;
    value: any;
};
/**
 * Map input inference type.
 */
type MapInput<TKey extends BaseSchema | BaseSchemaAsync, TValue extends BaseSchema | BaseSchemaAsync> = Map<Input<TKey>, Input<TValue>>;
/**
 * Map output inference type.
 */
type MapOutput<TKey extends BaseSchema | BaseSchemaAsync, TValue extends BaseSchema | BaseSchemaAsync> = Map<Output<TKey>, Output<TValue>>;

/**
 * Map schema type.
 */
type MapSchema<TKey extends BaseSchema, TValue extends BaseSchema, TOutput = MapOutput<TKey, TValue>> = BaseSchema<MapInput<TKey, TValue>, TOutput> & {
    type: 'map';
    key: TKey;
    value: TValue;
};
/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A map schema.
 */
declare function map<TKey extends BaseSchema, TValue extends BaseSchema>(key: TKey, value: TValue, pipe?: Pipe<MapOutput<TKey, TValue>>): MapSchema<TKey, TValue>;
/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A map schema.
 */
declare function map<TKey extends BaseSchema, TValue extends BaseSchema>(key: TKey, value: TValue, error?: ErrorMessage, pipe?: Pipe<MapOutput<TKey, TValue>>): MapSchema<TKey, TValue>;

/**
 * Map schema async type.
 */
type MapSchemaAsync<TKey extends BaseSchema | BaseSchemaAsync, TValue extends BaseSchema | BaseSchemaAsync, TOutput = MapOutput<TKey, TValue>> = BaseSchemaAsync<MapInput<TKey, TValue>, TOutput> & {
    type: 'map';
    key: TKey;
    value: TValue;
};
/**
 * Creates an async map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async map schema.
 */
declare function mapAsync<TKey extends BaseSchema | BaseSchemaAsync, TValue extends BaseSchema | BaseSchemaAsync>(key: TKey, value: TValue, pipe?: PipeAsync<MapOutput<TKey, TValue>>): MapSchemaAsync<TKey, TValue>;
/**
 * Creates an async map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async map schema.
 */
declare function mapAsync<TKey extends BaseSchema | BaseSchemaAsync, TValue extends BaseSchema | BaseSchemaAsync>(key: TKey, value: TValue, error?: ErrorMessage, pipe?: PipeAsync<MapOutput<TKey, TValue>>): MapSchemaAsync<TKey, TValue>;

/**
 * NaN schema type.
 */
type NanSchema<TOutput = number> = BaseSchema<number, TOutput> & {
    type: 'nan';
};
/**
 * Creates a NaN schema.
 *
 * @param error The error message.
 *
 * @returns A NaN schema.
 */
declare function nan(error?: ErrorMessage): NanSchema;

/**
 * NaN schema async type.
 */
type NanSchemaAsync<TOutput = number> = BaseSchemaAsync<number, TOutput> & {
    type: 'nan';
};
/**
 * Creates an async NaN schema.
 *
 * @param error The error message.
 *
 * @returns An async NaN schema.
 */
declare function nanAsync(error?: ErrorMessage): NanSchemaAsync;

/**
 * Never schema type.
 */
type NeverSchema = BaseSchema<never> & {
    type: 'never';
};
/**
 * Creates a never schema.
 *
 * @param error The error message.
 *
 * @returns A never schema.
 */
declare function never(error?: ErrorMessage): NeverSchema;

/**
 * Never schema async type.
 */
type NeverSchemaAsync = BaseSchemaAsync<never> & {
    type: 'never';
};
/**
 * Creates an async never schema.
 *
 * @param error The error message.
 *
 * @returns An async never schema.
 */
declare function neverAsync(error?: ErrorMessage): NeverSchemaAsync;

/**
 * Non nullable type.
 */
type NonNullable$1<T> = T extends null ? never : T;
/**
 * Non nullable schema type.
 */
type NonNullableSchema<TWrapped extends BaseSchema, TOutput = NonNullable$1<Output<TWrapped>>> = BaseSchema<NonNullable$1<Input<TWrapped>>, TOutput> & {
    type: 'non_nullable';
    wrapped: TWrapped;
};
/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non nullable schema.
 */
declare function nonNullable<TWrapped extends BaseSchema>(wrapped: TWrapped, error?: ErrorMessage): NonNullableSchema<TWrapped>;

/**
 * Non nullable schema async type.
 */
type NonNullableSchemaAsync<TWrapped extends BaseSchema | BaseSchemaAsync, TOutput = NonNullable$1<Output<TWrapped>>> = BaseSchemaAsync<NonNullable$1<Input<TWrapped>>, TOutput> & {
    type: 'non_nullable';
    wrapped: TWrapped;
};
/**
 * Creates an async non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns An async non nullable schema.
 */
declare function nonNullableAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(wrapped: TWrapped, error?: ErrorMessage): NonNullableSchemaAsync<TWrapped>;

/**
 * Non nullish type.
 */
type NonNullish<T> = T extends null | undefined ? never : T;
/**
 * Non nullish schema type.
 */
type NonNullishSchema<TWrapped extends BaseSchema, TOutput = NonNullish<Output<TWrapped>>> = BaseSchema<NonNullish<Input<TWrapped>>, TOutput> & {
    type: 'non_nullish';
    wrapped: TWrapped;
};
/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non nullish schema.
 */
declare function nonNullish<TWrapped extends BaseSchema>(wrapped: TWrapped, error?: ErrorMessage): NonNullishSchema<TWrapped>;

/**
 * Non nullish schema async type.
 */
type NonNullishSchemaAsync<TWrapped extends BaseSchema | BaseSchemaAsync, TOutput = NonNullish<Output<TWrapped>>> = BaseSchemaAsync<NonNullish<Input<TWrapped>>, TOutput> & {
    type: 'non_nullish';
    wrapped: TWrapped;
};
/**
 * Creates an async non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns An async non nullish schema.
 */
declare function nonNullishAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(wrapped: TWrapped, error?: ErrorMessage): NonNullishSchemaAsync<TWrapped>;

/**
 * Non optional type.
 */
type NonOptional<T> = T extends undefined ? never : T;
/**
 * Non optional schema type.
 */
type NonOptionalSchema<TWrapped extends BaseSchema, TOutput = NonOptional<Output<TWrapped>>> = BaseSchema<NonOptional<Input<TWrapped>>, TOutput> & {
    type: 'non_optional';
    wrapped: TWrapped;
};
/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non optional schema.
 */
declare function nonOptional<TWrapped extends BaseSchema>(wrapped: TWrapped, error?: ErrorMessage): NonOptionalSchema<TWrapped>;

/**
 * Non optional schema async type.
 */
type NonOptionalSchemaAsync<TWrapped extends BaseSchema | BaseSchemaAsync, TOutput = NonOptional<Output<TWrapped>>> = BaseSchemaAsync<NonOptional<Input<TWrapped>>, TOutput> & {
    type: 'non_optional';
    wrapped: TWrapped;
};
/**
 * Creates an async non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns An async non optional schema.
 */
declare function nonOptionalAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(wrapped: TWrapped, error?: ErrorMessage): NonOptionalSchemaAsync<TWrapped>;

/**
 * Nullable schema type.
 */
type NullableSchema<TWrapped extends BaseSchema, TDefault extends Input<TWrapped> | undefined = undefined, TOutput = TDefault extends Input<TWrapped> ? Output<TWrapped> : Output<TWrapped> | null> = BaseSchema<Input<TWrapped> | null, TOutput> & {
    type: 'nullable';
    wrapped: TWrapped;
    getDefault: () => TDefault;
};
/**
 * Creates a nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullable schema.
 */
declare function nullable<TWrapped extends BaseSchema, TDefault extends Input<TWrapped> | undefined = undefined>(wrapped: TWrapped, default_?: TDefault | (() => TDefault)): NullableSchema<TWrapped, TDefault>;

/**
 * Nullable schema async type.
 */
type NullableSchemaAsync<TWrapped extends BaseSchema | BaseSchemaAsync, TDefault extends Input<TWrapped> | undefined | Promise<Input<TWrapped> | undefined> = undefined, TOutput = Awaited<TDefault> extends Input<TWrapped> ? Output<TWrapped> : Output<TWrapped> | null> = BaseSchemaAsync<Input<TWrapped> | null, TOutput> & {
    type: 'nullable';
    wrapped: TWrapped;
    getDefault: () => Promise<TDefault>;
};
/**
 * Creates an async nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async nullable schema.
 */
declare function nullableAsync<TWrapped extends BaseSchema | BaseSchemaAsync, TDefault extends Input<TWrapped> | undefined | Promise<Input<TWrapped> | undefined> = undefined>(wrapped: TWrapped, default_?: TDefault | (() => TDefault)): NullableSchemaAsync<TWrapped, TDefault>;

/**
 * Nullish schema type.
 */
type NullishSchema<TWrapped extends BaseSchema, TDefault extends Input<TWrapped> | undefined = undefined, TOutput = TDefault extends Input<TWrapped> ? Output<TWrapped> : Output<TWrapped> | null | undefined> = BaseSchema<Input<TWrapped> | null | undefined, TOutput> & {
    type: 'nullish';
    wrapped: TWrapped;
    getDefault: () => TDefault;
};
/**
 * Creates a nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A nullish schema.
 */
declare function nullish<TWrapped extends BaseSchema, TDefault extends Input<TWrapped> | undefined = undefined>(wrapped: TWrapped, default_?: TDefault | (() => TDefault)): NullishSchema<TWrapped, TDefault>;

/**
 * Nullish schema async type.
 */
type NullishSchemaAsync<TWrapped extends BaseSchema | BaseSchemaAsync, TDefault extends Input<TWrapped> | undefined | Promise<Input<TWrapped> | undefined> = undefined, TOutput = Awaited<TDefault> extends Input<TWrapped> ? Output<TWrapped> : Output<TWrapped> | null | undefined> = BaseSchemaAsync<Input<TWrapped> | null | undefined, TOutput> & {
    type: 'nullish';
    wrapped: TWrapped;
    getDefault: () => Promise<TDefault>;
};
/**
 * Creates an async nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async nullish schema.
 */
declare function nullishAsync<TWrapped extends BaseSchema | BaseSchemaAsync, TDefault extends Input<TWrapped> | undefined | Promise<Input<TWrapped> | undefined> = undefined>(wrapped: TWrapped, default_?: TDefault | (() => TDefault)): NullishSchemaAsync<TWrapped, TDefault>;

/**
 * Null schema type.
 */
type NullSchema<TOutput = null> = BaseSchema<null, TOutput> & {
    type: 'null';
};
/**
 * Creates a null schema.
 *
 * @param error The error message.
 *
 * @returns A null schema.
 */
declare function null_(error?: ErrorMessage): NullSchema;
/**
 * See {@link null_}
 *
 * @deprecated Use `null_` instead.
 */
declare const nullType: typeof null_;

/**
 * Null schema async type.
 */
type NullSchemaAsync<TOutput = null> = BaseSchemaAsync<null, TOutput> & {
    type: 'null';
};
/**
 * Creates an async null schema.
 *
 * @param error The error message.
 *
 * @returns An async null schema.
 */
declare function nullAsync(error?: ErrorMessage): NullSchemaAsync;
/**
 * See {@link nullAsync}
 *
 * @deprecated Use `nullAsync` instead.
 */
declare const nullTypeAsync: typeof nullAsync;

/**
 * Number schema type.
 */
type NumberSchema<TOutput = number> = BaseSchema<number, TOutput> & {
    type: 'number';
};
/**
 * Creates a number schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A number schema.
 */
declare function number(pipe?: Pipe<number>): NumberSchema;
/**
 * Creates a number schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A number schema.
 */
declare function number(error?: ErrorMessage, pipe?: Pipe<number>): NumberSchema;

/**
 * Number schema async type.
 */
type NumberSchemaAsync<TOutput = number> = BaseSchemaAsync<number, TOutput> & {
    type: 'number';
};
/**
 * Creates an async number schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async number schema.
 */
declare function numberAsync(pipe?: PipeAsync<number>): NumberSchemaAsync;
/**
 * Creates an async number schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async number schema.
 */
declare function numberAsync(error?: ErrorMessage, pipe?: PipeAsync<number>): NumberSchemaAsync;

/**
 * Object entries async type.
 */
type ObjectEntriesAsync = Record<string, BaseSchema | BaseSchemaAsync>;
/**
 * Object schema async type.
 */
type ObjectSchemaAsync<TEntries extends ObjectEntriesAsync, TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined, TOutput = ObjectOutput<TEntries, TRest>> = BaseSchemaAsync<ObjectInput<TEntries, TRest>, TOutput> & {
    type: 'object';
    entries: TEntries;
    rest: TRest;
};
/**
 * Creates an async object schema.
 *
 * @param entries The object entries.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function objectAsync<TEntries extends ObjectEntriesAsync>(entries: TEntries, pipe?: PipeAsync<ObjectOutput<TEntries, undefined>>): ObjectSchemaAsync<TEntries>;
/**
 * Creates an async object schema.
 *
 * @param entries The object entries.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function objectAsync<TEntries extends ObjectEntriesAsync>(entries: TEntries, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<TEntries, undefined>>): ObjectSchemaAsync<TEntries>;
/**
 * Creates an async object schema.
 *
 * @param entries The object entries.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function objectAsync<TEntries extends ObjectEntriesAsync, TRest extends BaseSchema | BaseSchemaAsync | undefined>(entries: TEntries, rest: TRest, pipe?: PipeAsync<ObjectOutput<TEntries, TRest>>): ObjectSchemaAsync<TEntries, TRest>;
/**
 * Creates an async object schema.
 *
 * @param entries The object entries.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function objectAsync<TEntries extends ObjectEntriesAsync, TRest extends BaseSchema | BaseSchemaAsync | undefined>(entries: TEntries, rest: TRest, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<TEntries, TRest>>): ObjectSchemaAsync<TEntries, TRest>;

/**
 * Object path item type.
 */
type ObjectPathItem = {
    type: 'object';
    input: Record<string, any>;
    key: string;
    value: any;
};
/**
 * Required object keys type.
 */
type RequiredKeys<TObject extends object> = {
    [TKey in keyof TObject]: undefined extends TObject[TKey] ? never : TKey;
}[keyof TObject];
/**
 * Optional object keys type.
 */
type OptionalKeys<TObject extends object> = {
    [TKey in keyof TObject]: undefined extends TObject[TKey] ? TKey : never;
}[keyof TObject];
/**
 * Object with question marks type.
 */
type WithQuestionMarks<TObject extends object> = Pick<TObject, RequiredKeys<TObject>> & Partial<Pick<TObject, OptionalKeys<TObject>>>;
/**
 * Object input inference type.
 */
type ObjectInput<TEntries extends ObjectEntries | ObjectEntriesAsync, TRest extends BaseSchema | BaseSchemaAsync | undefined> = TRest extends undefined | NeverSchema | NeverSchemaAsync ? ResolveObject<WithQuestionMarks<{
    [TKey in keyof TEntries]: Input<TEntries[TKey]>;
}>> : TRest extends BaseSchema | BaseSchemaAsync ? ResolveObject<WithQuestionMarks<{
    [TKey in keyof TEntries]: Input<TEntries[TKey]>;
}>> & Record<string, Input<TRest>> : never;
/**
 * Object output inference type.
 */
type ObjectOutput<TEntries extends ObjectEntries | ObjectEntriesAsync, TRest extends BaseSchema | BaseSchemaAsync | undefined> = TRest extends undefined | NeverSchema | NeverSchemaAsync ? ResolveObject<WithQuestionMarks<{
    [TKey in keyof TEntries]: Output<TEntries[TKey]>;
}>> : TRest extends BaseSchema | BaseSchemaAsync ? ResolveObject<WithQuestionMarks<{
    [TKey in keyof TEntries]: Output<TEntries[TKey]>;
}>> & Record<string, Output<TRest>> : never;

/**
 * Object entries type.
 */
type ObjectEntries = Record<string, BaseSchema>;
/**
 * Object schema type.
 */
type ObjectSchema<TEntries extends ObjectEntries, TRest extends BaseSchema | undefined = undefined, TOutput = ObjectOutput<TEntries, TRest>> = BaseSchema<ObjectInput<TEntries, TRest>, TOutput> & {
    type: 'object';
    entries: TEntries;
    rest: TRest;
};
/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function object<TEntries extends ObjectEntries>(entries: TEntries, pipe?: Pipe<ObjectOutput<TEntries, undefined>>): ObjectSchema<TEntries>;
/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function object<TEntries extends ObjectEntries>(entries: TEntries, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<TEntries, undefined>>): ObjectSchema<TEntries>;
/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function object<TEntries extends ObjectEntries, TRest extends BaseSchema | undefined>(entries: TEntries, rest: TRest, pipe?: Pipe<ObjectOutput<TEntries, TRest>>): ObjectSchema<TEntries, TRest>;
/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function object<TEntries extends ObjectEntries, TRest extends BaseSchema | undefined>(entries: TEntries, rest: TRest, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<TEntries, TRest>>): ObjectSchema<TEntries, TRest>;

/**
 * Optional schema type.
 */
type OptionalSchema<TWrapped extends BaseSchema, TDefault extends Input<TWrapped> | undefined = undefined, TOutput = TDefault extends Input<TWrapped> ? Output<TWrapped> : Output<TWrapped> | undefined> = BaseSchema<Input<TWrapped> | undefined, TOutput> & {
    type: 'optional';
    wrapped: TWrapped;
    getDefault: () => TDefault;
};
/**
 * Creates a optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns A optional schema.
 */
declare function optional<TWrapped extends BaseSchema, TDefault extends Input<TWrapped> | undefined = undefined>(wrapped: TWrapped, default_?: TDefault | (() => TDefault)): OptionalSchema<TWrapped, TDefault>;

/**
 * Optional schema async type.
 */
type OptionalSchemaAsync<TWrapped extends BaseSchema | BaseSchemaAsync, TDefault extends Input<TWrapped> | undefined | Promise<Input<TWrapped> | undefined> = undefined, TOutput = Awaited<TDefault> extends Input<TWrapped> ? Output<TWrapped> : Output<TWrapped> | undefined> = BaseSchemaAsync<Input<TWrapped> | undefined, TOutput> & {
    type: 'optional';
    wrapped: TWrapped;
    getDefault: () => Promise<TDefault>;
};
/**
 * Creates an async optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async optional schema.
 */
declare function optionalAsync<TWrapped extends BaseSchema | BaseSchemaAsync, TDefault extends Input<TWrapped> | undefined | Promise<Input<TWrapped> | undefined> = undefined>(wrapped: TWrapped, default_?: TDefault | (() => TDefault)): OptionalSchemaAsync<TWrapped, TDefault>;

/**
 * Picklist options type.
 */
type PicklistOptions<TOption extends string = string> = Readonly<[TOption, ...TOption[]]> | [TOption, ...TOption[]];

/**
 * Picklist schema type.
 */
type PicklistSchema<Toptions extends PicklistOptions, TOutput = Toptions[number]> = BaseSchema<Toptions[number], TOutput> & {
    type: 'picklist';
    options: Toptions;
};
/**
 * Creates a picklist schema.
 *
 * @param options The picklist value.
 * @param error The error message.
 *
 * @returns A picklist schema.
 */
declare function picklist<TOption extends string, TOptions extends PicklistOptions<TOption>>(options: TOptions, error?: ErrorMessage): PicklistSchema<TOptions>;
/**
 * See {@link picklist}
 *
 * @deprecated Use `picklist` instead.
 */
declare const enumType: typeof picklist;

/**
 * Picklist schema async type.
 */
type PicklistSchemaAsync<TOptions extends PicklistOptions, TOutput = TOptions[number]> = BaseSchemaAsync<TOptions[number], TOutput> & {
    type: 'picklist';
    options: TOptions;
};
/**
 * Creates an async picklist schema.
 *
 * @param options The picklist options.
 * @param error The error message.
 *
 * @returns An async picklist schema.
 */
declare function picklistAsync<TOption extends string, TOptions extends PicklistOptions<TOption>>(options: TOptions, error?: ErrorMessage): PicklistSchemaAsync<TOptions>;
/**
 * See {@link picklistAsync}
 *
 * @deprecated Use `picklistAsync` instead.
 */
declare const enumTypeAsync: typeof picklistAsync;

/**
 * String schema type.
 */
type StringSchema<TOutput = string> = BaseSchema<string, TOutput> & {
    type: 'string';
};
/**
 * Creates a string schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A string schema.
 */
declare function string(pipe?: Pipe<string>): StringSchema;
/**
 * Creates a string schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A string schema.
 */
declare function string(error?: ErrorMessage, pipe?: Pipe<string>): StringSchema;

/**
 * String schema async type.
 */
type StringSchemaAsync<TOutput = string> = BaseSchemaAsync<string, TOutput> & {
    type: 'string';
};
/**
 * Creates an async string schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async string schema.
 */
declare function stringAsync(pipe?: PipeAsync<string>): StringSchemaAsync;
/**
 * Creates an async string schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async string schema.
 */
declare function stringAsync(error?: ErrorMessage, pipe?: PipeAsync<string>): StringSchemaAsync;

/**
 * Union options type.
 */
type UnionOptions = [BaseSchema, BaseSchema, ...BaseSchema[]];
/**
 * Union schema type.
 */
type UnionSchema<TOptions extends UnionOptions, TOutput = Output<TOptions[number]>> = BaseSchema<Input<TOptions[number]>, TOutput> & {
    type: 'union';
    options: TOptions;
};
/**
 * Creates a union schema.
 *
 * @param options The union options.
 * @param error The error message.
 *
 * @returns A union schema.
 */
declare function union<TOptions extends UnionOptions>(options: TOptions, error?: ErrorMessage): UnionSchema<TOptions>;

/**
 * Union options async type.
 */
type UnionOptionsAsync = [
    BaseSchema | BaseSchemaAsync,
    BaseSchema | BaseSchemaAsync,
    ...(BaseSchema[] | BaseSchemaAsync[])
];
/**
 * Union schema async type.
 */
type UnionSchemaAsync<TOptions extends UnionOptionsAsync, TOutput = Output<TOptions[number]>> = BaseSchemaAsync<Input<TOptions[number]>, TOutput> & {
    type: 'union';
    options: TOptions;
};
/**
 * Creates an async union schema.
 *
 * @param union The union options.
 * @param error The error message.
 *
 * @returns An async union schema.
 */
declare function unionAsync<TOptions extends UnionOptionsAsync>(options: TOptions, error?: ErrorMessage): UnionSchemaAsync<TOptions>;

/**
 * Record key type.
 */
type RecordKeyAsync = EnumSchema<any, string | number | symbol> | EnumSchemaAsync<any, string | number | symbol> | PicklistSchema<any, string | number | symbol> | PicklistSchemaAsync<any, string | number | symbol> | StringSchema<string | number | symbol> | StringSchemaAsync<string | number | symbol> | UnionSchema<any, string | number | symbol> | UnionSchemaAsync<any, string | number | symbol>;
/**
 * Record schema async type.
 */
type RecordSchemaAsync<TKey extends RecordKeyAsync, TValue extends BaseSchema | BaseSchemaAsync, TOutput = RecordOutput<TKey, TValue>> = BaseSchemaAsync<RecordInput<TKey, TValue>, TOutput> & {
    type: 'record';
    key: TKey;
    value: TValue;
};
/**
 * Creates an async record schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async record schema.
 */
declare function recordAsync<TValue extends BaseSchema | BaseSchemaAsync>(value: TValue, pipe?: PipeAsync<RecordOutput<StringSchema, TValue>>): RecordSchemaAsync<StringSchema, TValue>;
/**
 * Creates an async record schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async record schema.
 */
declare function recordAsync<TValue extends BaseSchema | BaseSchemaAsync>(value: TValue, error?: ErrorMessage, pipe?: PipeAsync<RecordOutput<StringSchema, TValue>>): RecordSchemaAsync<StringSchema, TValue>;
/**
 * Creates an async record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async record schema.
 */
declare function recordAsync<TKey extends RecordKeyAsync, TValue extends BaseSchema | BaseSchemaAsync>(key: TKey, value: TValue, pipe?: PipeAsync<RecordOutput<TKey, TValue>>): RecordSchemaAsync<TKey, TValue>;
/**
 * Creates an async record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async record schema.
 */
declare function recordAsync<TKey extends RecordKeyAsync, TValue extends BaseSchema | BaseSchemaAsync>(key: TKey, value: TValue, error?: ErrorMessage, pipe?: PipeAsync<RecordOutput<TKey, TValue>>): RecordSchemaAsync<TKey, TValue>;

/**
 * Record path item type.
 */
type RecordPathItem = {
    type: 'record';
    input: Record<string | number | symbol, any>;
    key: string | number | symbol;
    value: any;
};
/**
 * Partial key schema type.
 */
type PartialKeySchema = PicklistSchema<any> | PicklistSchemaAsync<any> | EnumSchema<any> | EnumSchemaAsync<any> | UnionSchema<any>;
/**
 * Record input inference type.
 */
type RecordInput<TKey extends RecordKey | RecordKeyAsync, TValue extends BaseSchema | BaseSchemaAsync> = ResolveObject<TKey extends PartialKeySchema ? Partial<Record<Input<TKey>, Input<TValue>>> : Record<Input<TKey>, Input<TValue>>>;
/**
 * Record output inference type.
 */
type RecordOutput<TKey extends RecordKey | RecordKeyAsync, TValue extends BaseSchema | BaseSchemaAsync> = ResolveObject<TKey extends PartialKeySchema ? Partial<Record<Output<TKey>, Output<TValue>>> : Record<Output<TKey>, Output<TValue>>>;

/**
 * Record key type.
 */
type RecordKey = EnumSchema<any, string | number | symbol> | PicklistSchema<any, string | number | symbol> | StringSchema<string | number | symbol> | UnionSchema<any, string | number | symbol>;
/**
 * Record schema type.
 */
type RecordSchema<TKey extends RecordKey, TValue extends BaseSchema, TOutput = RecordOutput<TKey, TValue>> = BaseSchema<RecordInput<TKey, TValue>, TOutput> & {
    type: 'record';
    key: TKey;
    value: TValue;
};
/**
 * Creates a record schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
declare function record<TValue extends BaseSchema>(value: TValue, pipe?: Pipe<RecordOutput<StringSchema, TValue>>): RecordSchema<StringSchema, TValue>;
/**
 * Creates a record schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
declare function record<TValue extends BaseSchema>(value: TValue, error?: ErrorMessage, pipe?: Pipe<RecordOutput<StringSchema, TValue>>): RecordSchema<StringSchema, TValue>;
/**
 * Creates a record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
declare function record<TKey extends RecordKey, TValue extends BaseSchema>(key: TKey, value: TValue, pipe?: Pipe<RecordOutput<TKey, TValue>>): RecordSchema<TKey, TValue>;
/**
 * Creates a record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
declare function record<TKey extends RecordKey, TValue extends BaseSchema>(key: TKey, value: TValue, error?: ErrorMessage, pipe?: Pipe<RecordOutput<TKey, TValue>>): RecordSchema<TKey, TValue>;

/**
 * Recursive schema type.
 */
type RecursiveSchema<TSchemaGetter extends () => BaseSchema, TOutput = Output<ReturnType<TSchemaGetter>>> = BaseSchema<Input<ReturnType<TSchemaGetter>>, TOutput> & {
    type: 'recursive';
    getter: TSchemaGetter;
};
/**
 * Creates a recursive schema.
 *
 * @param getter The schema getter.
 *
 * @returns A recursive schema.
 */
declare function recursive<TSchemaGetter extends () => BaseSchema>(getter: TSchemaGetter): RecursiveSchema<TSchemaGetter>;

/**
 * Recursive schema async type.
 */
type RecursiveSchemaAsync<TSchemaGetter extends () => BaseSchema | BaseSchemaAsync, TOutput = Output<ReturnType<TSchemaGetter>>> = BaseSchemaAsync<Input<ReturnType<TSchemaGetter>>, TOutput> & {
    type: 'recursive';
    getter: TSchemaGetter;
};
/**
 * Creates an async recursive schema.
 *
 * @param getter The schema getter.
 *
 * @returns An async recursive schema.
 */
declare function recursiveAsync<TSchemaGetter extends () => BaseSchema | BaseSchemaAsync>(getter: TSchemaGetter): RecursiveSchemaAsync<TSchemaGetter>;

/**
 * Set path item type.
 */
type SetPathItem = {
    type: 'set';
    input: Set<any>;
    key: number;
    value: any;
};
/**
 * Set output inference type.
 */
type SetInput<TValue extends BaseSchema | BaseSchemaAsync> = Set<Input<TValue>>;
/**
 * Set output inference type.
 */
type SetOutput<TValue extends BaseSchema | BaseSchemaAsync> = Set<Output<TValue>>;

/**
 * Set schema type.
 */
type SetSchema<TValue extends BaseSchema, TOutput = SetOutput<TValue>> = BaseSchema<SetInput<TValue>, TOutput> & {
    type: 'set';
    value: TValue;
};
/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A set schema.
 */
declare function set<TValue extends BaseSchema>(value: TValue, pipe?: Pipe<SetOutput<TValue>>): SetSchema<TValue>;
/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A set schema.
 */
declare function set<TValue extends BaseSchema>(value: TValue, error?: ErrorMessage, pipe?: Pipe<SetOutput<TValue>>): SetSchema<TValue>;

/**
 * Set schema async type.
 */
type SetSchemaAsync<TValue extends BaseSchema | BaseSchemaAsync, TOutput = SetOutput<TValue>> = BaseSchemaAsync<SetInput<TValue>, TOutput> & {
    type: 'set';
    value: TValue;
};
/**
 * Creates an async set schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async set schema.
 */
declare function setAsync<TValue extends BaseSchema | BaseSchemaAsync>(value: TValue, pipe?: PipeAsync<SetOutput<TValue>>): SetSchemaAsync<TValue>;
/**
 * Creates an async set schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async set schema.
 */
declare function setAsync<TValue extends BaseSchema | BaseSchemaAsync>(value: TValue, error?: ErrorMessage, pipe?: PipeAsync<SetOutput<TValue>>): SetSchemaAsync<TValue>;

/**
 * Special schema type.
 */
type SpecialSchema<TInput, TOutput = TInput> = BaseSchema<TInput, TOutput> & {
    type: 'special';
};
/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
declare function special<TInput>(check: (input: unknown) => boolean, pipe?: Pipe<TInput>): SpecialSchema<TInput>;
/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
declare function special<TInput>(check: (input: unknown) => boolean, error?: ErrorMessage, pipe?: Pipe<TInput>): SpecialSchema<TInput>;

/**
 * Special schema async type.
 */
type SpecialSchemaAsync<TInput, TOutput = TInput> = BaseSchemaAsync<TInput, TOutput> & {
    type: 'special';
};
/**
 * Creates an async special schema.
 *
 * @param check The type check function.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async special schema.
 */
declare function specialAsync<TInput>(check: (input: unknown) => boolean | Promise<boolean>, pipe?: PipeAsync<TInput>): SpecialSchemaAsync<TInput>;
/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
declare function specialAsync<TInput>(check: (input: unknown) => boolean | Promise<boolean>, error?: ErrorMessage, pipe?: PipeAsync<TInput>): SpecialSchemaAsync<TInput>;

/**
 * Symbol schema type.
 */
type SymbolSchema<TOutput = symbol> = BaseSchema<symbol, TOutput> & {
    type: 'symbol';
};
/**
 * Creates a symbol schema.
 *
 * @param error The error message.
 *
 * @returns A symbol schema.
 */
declare function symbol(error?: ErrorMessage): SymbolSchema;

/**
 * Symbol schema async type.
 */
type SymbolSchemaAsync<TOutput = symbol> = BaseSchemaAsync<symbol, TOutput> & {
    type: 'symbol';
};
/**
 * Creates an async symbol schema.
 *
 * @param error The error message.
 *
 * @returns An async symbol schema.
 */
declare function symbolAsync(error?: ErrorMessage): SymbolSchemaAsync;

/**
 * Tuple shape async type.
 */
type TupleItemsAsync = [
    BaseSchema | BaseSchemaAsync,
    ...(BaseSchema | BaseSchemaAsync)[]
];
/**
 * Tuple schema async type.
 */
type TupleSchemaAsync<TItems extends TupleItemsAsync, TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined, TOutput = TupleOutput<TItems, TRest>> = BaseSchemaAsync<TupleInput<TItems, TRest>, TOutput> & {
    type: 'tuple';
    items: TItems;
    rest: TRest;
};
/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
declare function tupleAsync<TItems extends TupleItemsAsync>(items: TItems, pipe?: PipeAsync<TupleOutput<TItems, undefined>>): TupleSchemaAsync<TItems>;
/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
declare function tupleAsync<TItems extends TupleItemsAsync>(items: TItems, error?: ErrorMessage, pipe?: PipeAsync<TupleOutput<TItems, undefined>>): TupleSchemaAsync<TItems>;
/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
declare function tupleAsync<TItems extends TupleItemsAsync, TRest extends BaseSchema | BaseSchemaAsync | undefined>(items: TItems, rest: TRest, pipe?: PipeAsync<TupleOutput<TItems, TRest>>): TupleSchemaAsync<TItems, TRest>;
/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
declare function tupleAsync<TItems extends TupleItemsAsync, TRest extends BaseSchema | BaseSchemaAsync | undefined>(items: TItems, rest: TRest, error?: ErrorMessage, pipe?: PipeAsync<TupleOutput<TItems, TRest>>): TupleSchemaAsync<TItems, TRest>;

/**
 * Tuple path item type.
 */
type TuplePathItem = {
    type: 'tuple';
    input: [any, ...any[]];
    key: number;
    value: any;
};
/**
 * Tuple input inference type.
 */
type TupleInput<TItems extends TupleItems | TupleItemsAsync, TRest extends BaseSchema | BaseSchemaAsync | undefined> = TRest extends undefined | NeverSchema | NeverSchemaAsync ? {
    [TKey in keyof TItems]: Input<TItems[TKey]>;
} : TRest extends BaseSchema | BaseSchemaAsync ? [
    ...{
        [TKey in keyof TItems]: Input<TItems[TKey]>;
    },
    ...Input<TRest>[]
] : never;
/**
 * Tuple with rest output inference type.
 */
type TupleOutput<TItems extends TupleItems | TupleItemsAsync, TRest extends BaseSchema | BaseSchemaAsync | undefined> = TRest extends undefined | NeverSchema | NeverSchemaAsync ? {
    [TKey in keyof TItems]: Output<TItems[TKey]>;
} : TRest extends BaseSchema | BaseSchemaAsync ? [
    ...{
        [TKey in keyof TItems]: Output<TItems[TKey]>;
    },
    ...Output<TRest>[]
] : never;

/**
 * Tuple shape type.
 */
type TupleItems = [BaseSchema, ...BaseSchema[]];
/**
 * Tuple schema type.
 */
type TupleSchema<TItems extends TupleItems, TRest extends BaseSchema | undefined = undefined, TOutput = TupleOutput<TItems, TRest>> = BaseSchema<TupleInput<TItems, TRest>, TOutput> & {
    type: 'tuple';
    items: TItems;
    rest: TRest;
};
/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
declare function tuple<TItems extends TupleItems>(items: TItems, pipe?: Pipe<TupleOutput<TItems, undefined>>): TupleSchema<TItems>;
/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
declare function tuple<TItems extends TupleItems>(items: TItems, error?: ErrorMessage, pipe?: Pipe<TupleOutput<TItems, undefined>>): TupleSchema<TItems>;
/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
declare function tuple<TItems extends TupleItems, TRest extends BaseSchema | undefined>(items: TItems, rest: TRest, pipe?: Pipe<TupleOutput<TItems, TRest>>): TupleSchema<TItems, TRest>;
/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
declare function tuple<TItems extends TupleItems, TRest extends BaseSchema | undefined>(items: TItems, rest: TRest, error?: ErrorMessage, pipe?: Pipe<TupleOutput<TItems, TRest>>): TupleSchema<TItems, TRest>;

/**
 * Undefined schema type.
 */
type UndefinedSchema<TOutput = undefined> = BaseSchema<undefined, TOutput> & {
    type: 'undefined';
};
/**
 * Creates a undefined schema.
 *
 * @param error The error message.
 *
 * @returns A undefined schema.
 */
declare function undefined_(error?: ErrorMessage): UndefinedSchema;
/**
 * See {@link undefined_}
 *
 * @deprecated Use `undefined_` instead.
 */
declare const undefinedType: typeof undefined_;

/**
 * Undefined schema async type.
 */
type UndefinedSchemaAsync<TOutput = undefined> = BaseSchemaAsync<undefined, TOutput> & {
    type: 'undefined';
};
/**
 * Creates an async undefined schema.
 *
 * @param error The error message.
 *
 * @returns An async undefined schema.
 */
declare function undefinedAsync(error?: ErrorMessage): UndefinedSchemaAsync;
/**
 * See {@link undefinedAsync}
 *
 * @deprecated Use `undefinedAsync` instead.
 */
declare const undefinedTypeAsync: typeof undefinedAsync;

/**
 * Unknown schema type.
 */
type UnknownSchema<TOutput = unknown> = BaseSchema<unknown, TOutput> & {
    type: 'unknown';
};
/**
 * Creates a unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A unknown schema.
 */
declare function unknown(pipe?: Pipe<unknown>): UnknownSchema;

/**
 * Unknown schema async type.
 */
type UnknownSchemaAsync<TOutput = unknown> = BaseSchemaAsync<unknown, TOutput> & {
    type: 'unknown';
};
/**
 * Creates an async unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async unknown schema.
 */
declare function unknownAsync(pipe?: PipeAsync<unknown>): UnknownSchemaAsync;

/**
 * Variant option type.
 */
type VariantOption<TKey extends string> = ObjectSchema<Record<TKey, BaseSchema>, any> | (BaseSchema & {
    type: 'variant';
    options: VariantOptions<TKey>;
});
/**
 * Variant options type.
 */
type VariantOptions<TKey extends string> = [
    VariantOption<TKey>,
    VariantOption<TKey>,
    ...VariantOption<TKey>[]
];
/**
 * Variant schema type.
 */
type VariantSchema<TKey extends string, TOptions extends VariantOptions<TKey>, TOutput = Output<TOptions[number]>> = BaseSchema<Input<TOptions[number]>, TOutput> & {
    type: 'variant';
    options: TOptions;
};
/**
 * Creates a variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param error The error message.
 *
 * @returns A variant schema.
 */
declare function variant<TKey extends string, TOptions extends VariantOptions<TKey>>(key: TKey, options: TOptions, error?: ErrorMessage): VariantSchema<TKey, TOptions>;
/**
 * See {@link variant}
 *
 * @deprecated Use `variant` instead.
 */
declare const discriminatedUnion: typeof variant;

/**
 * Variant option async type.
 */
type VariantOptionAsync<TKey extends string> = ObjectSchema<Record<TKey, BaseSchema>, any> | ObjectSchemaAsync<Record<TKey, BaseSchema | BaseSchemaAsync>, any> | ((BaseSchema | BaseSchemaAsync) & {
    type: 'variant';
    options: VariantOptionsAsync<TKey>;
});
/**
 * Variant options async type.
 */
type VariantOptionsAsync<TKey extends string> = [
    VariantOptionAsync<TKey>,
    VariantOptionAsync<TKey>,
    ...VariantOptionAsync<TKey>[]
];
/**
 * Variant schema async type.
 */
type VariantSchemaAsync<TKey extends string, TOptions extends VariantOptionsAsync<TKey>, TOutput = Output<TOptions[number]>> = BaseSchemaAsync<Input<TOptions[number]>, TOutput> & {
    type: 'variant';
    options: TOptions;
};
/**
 * Creates an async variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param error The error message.
 *
 * @returns An async variant schema.
 */
declare function variantAsync<TKey extends string, TOptions extends VariantOptionsAsync<TKey>>(key: TKey, options: TOptions, error?: ErrorMessage): VariantSchemaAsync<TKey, TOptions>;
/**
 * See {@link variantAsync}
 *
 * @deprecated Use `variantAsync` instead.
 */
declare const discriminatedUnionAsync: typeof variantAsync;

/**
 * Void schema type.
 */
type VoidSchema<TOutput = void> = BaseSchema<void, TOutput> & {
    type: 'void';
};
/**
 * Creates a void schema.
 *
 * @param error The error message.
 *
 * @returns A void schema.
 */
declare function void_(error?: ErrorMessage): VoidSchema;
/**
 * See {@link void_}
 *
 * @deprecated Use `void_` instead.
 */
declare const voidType: typeof void_;

/**
 * Void schema async type.
 */
type VoidSchemaAsync<TOutput = void> = BaseSchemaAsync<void, TOutput> & {
    type: 'void';
};
/**
 * Creates an async void schema.
 *
 * @param error The error message.
 *
 * @returns An async void schema.
 */
declare function voidAsync(error?: ErrorMessage): VoidSchemaAsync;
/**
 * See {@link voidAsync}
 *
 * @deprecated Use `voidAsync` instead.
 */
declare const voidTypeAsync: typeof voidAsync;

/**
 * A Valibot error with useful information.
 */
declare class ValiError extends Error {
    issues: Issues;
    /**
     * Creates a Valibot error with useful information.
     *
     * @param issues The error issues.
     */
    constructor(issues: Issues);
}

/**
 * Dot path type.
 */
type DotPath<TKey, TSchema extends BaseSchema | BaseSchemaAsync> = TKey extends string | number ? `${TKey}` | `${TKey}.${NestedPath<TSchema>}` : never;
/**
 * Object path type.
 */
type ObjectPath<TEntries extends ObjectEntries | ObjectEntriesAsync> = {
    [TKey in keyof TEntries]: DotPath<TKey, TEntries[TKey]>;
}[keyof TEntries];
/**
 * Tuple key type.
 */
type TupleKey<T extends any[]> = Exclude<keyof T, keyof any[]>;
/**
 * Tuple path type.
 */
type TuplePath<TItems extends TupleItems | TupleItemsAsync> = {
    [TKey in TupleKey<TItems>]: DotPath<TKey, TItems[TKey & number]>;
}[TupleKey<TItems>];
/**
 * Nested path type.
 */
type NestedPath<TSchema extends BaseSchema | BaseSchemaAsync> = TSchema extends ArraySchema<infer TItem extends BaseSchema> ? DotPath<number, TItem> : TSchema extends ArraySchemaAsync<infer TItem extends BaseSchema | BaseSchemaAsync> ? DotPath<number, TItem> : TSchema extends MapSchema<infer TKey, infer TValue> | MapSchemaAsync<infer TKey, infer TValue> ? DotPath<Input<TKey>, TValue> : TSchema extends ObjectSchema<infer TEntries, infer TRest> | ObjectSchemaAsync<infer TEntries, infer TRest> ? TRest extends BaseSchema | BaseSchemaAsync ? ObjectPath<TEntries> | DotPath<string, TRest> : ObjectPath<TEntries> : TSchema extends RecordSchema<infer TKey, infer TValue> | RecordSchemaAsync<infer TKey, infer TValue> ? DotPath<Input<TKey>, TValue> : TSchema extends RecursiveSchema<infer TSchemaGetter extends () => BaseSchema> ? NestedPath<ReturnType<TSchemaGetter>> : TSchema extends RecursiveSchemaAsync<infer TSchemaGetter extends () => BaseSchema | BaseSchemaAsync> ? NestedPath<ReturnType<TSchemaGetter>> : TSchema extends SetSchema<infer TValue> | SetSchemaAsync<infer TValue> ? DotPath<number, TValue> : TSchema extends TupleSchema<infer TItems, infer TRest> | TupleSchemaAsync<infer TItems, infer TRest> ? TRest extends BaseSchema | BaseSchemaAsync ? TuplePath<TItems> | DotPath<number, TRest> : TuplePath<TItems> : TSchema extends UnionSchema<infer TUnionOptions extends UnionOptions> ? NestedPath<TUnionOptions[number]> : TSchema extends UnionSchemaAsync<infer TUnionOptions extends UnionOptionsAsync> ? NestedPath<TUnionOptions[number]> : never;
/**
 * Flat errors type.
 */
type FlatErrors<TSchema extends BaseSchema | BaseSchemaAsync = any> = {
    root?: [string, ...string[]];
    nested: Partial<Record<NestedPath<TSchema>, [string, ...string[]]>>;
};
/**
 * Flatten the error messages of a Vali error.
 *
 * @param error A Vali error.
 *
 * @returns Flat errors.
 */
declare function flatten<TSchema extends BaseSchema | BaseSchemaAsync = any>(error: ValiError): FlatErrors<TSchema>;
/**
 * Flatten the error messages of issues.
 *
 * @param issues The issues.
 *
 * @returns Flat errors.
 */
declare function flatten<TSchema extends BaseSchema | BaseSchemaAsync = any>(issues: Issues): FlatErrors<TSchema>;

/**
 * Brand symbol.
 */
declare const BrandSymbol: unique symbol;
/**
 * Brand name type.
 */
type BrandName = string | number | symbol;
/**
 * Brand type.
 */
type Brand<TName extends BrandName> = {
    [BrandSymbol]: {
        [TValue in TName]: TValue;
    };
};
/**
 * Schema with brand type.
 */
type SchemaWithBrand<TSchema extends BaseSchema | BaseSchemaAsync, TName extends BrandName> = Omit<TSchema, '_types'> & {
    _types?: {
        input: Input<TSchema>;
        output: Output<TSchema> & Brand<TName>;
    };
};
/**
 * Brands the output type of a schema.
 *
 * @param schema The scheme to be branded.
 * @param brand The brand name.
 *
 * @returns The branded schema.
 */
declare function brand<TSchema extends BaseSchema | BaseSchemaAsync, TName extends BrandName>(schema: TSchema, name: TName): SchemaWithBrand<TSchema, TName>;

/**
 * Coerces the input of a schema to match the required type.
 *
 * @param schema The affected schema.
 * @param action The coerceation action.
 *
 * @returns The passed schema.
 */
declare function coerce<TSchema extends BaseSchema>(schema: TSchema, action: (value: unknown) => unknown): TSchema;

/**
 * Coerces the input of a async schema to match the required type.
 *
 * @param schema The affected schema.
 * @param action The coerceation action.
 *
 * @returns The passed schema.
 */
declare function coerceAsync<TSchema extends BaseSchemaAsync>(schema: TSchema, action: (value: unknown) => unknown): TSchema;

/**
 * Fallback info type.
 */
type FallbackInfo = {
    input: unknown;
    issues: Issues;
};

/**
 * Schema with fallback type.
 */
type SchemaWithFallback<TSchema extends BaseSchema = BaseSchema, TFallback extends Output<TSchema> = Output<TSchema>> = TSchema & {
    getFallback: (info?: FallbackInfo) => TFallback;
};
/**
 * Returns a fallback value when validating the passed schema failed.
 *
 * @param schema The schema to catch.
 * @param fallback The fallback value.
 *
 * @returns The passed schema.
 */
declare function fallback<TSchema extends BaseSchema, TFallback extends Output<TSchema>>(schema: TSchema, fallback: TFallback | ((info?: FallbackInfo) => TFallback)): SchemaWithFallback<TSchema, TFallback>;

/**
 * Schema with fallback async type.
 */
type SchemaWithFallbackAsync<TSchema extends BaseSchemaAsync = BaseSchemaAsync, TFallback extends Output<TSchema> = Output<TSchema>> = TSchema & {
    getFallback: (info?: FallbackInfo) => Promise<TFallback>;
};
/**
 * Returns a fallback value when validating the passed schema failed.
 *
 * @param schema The schema to catch.
 * @param fallback The fallback value.
 *
 * @returns The passed schema.
 */
declare function fallbackAsync<TSchema extends BaseSchemaAsync, TFallback extends Output<TSchema>>(schema: TSchema, fallback: TFallback | ((info?: FallbackInfo) => TFallback | Promise<TFallback>)): SchemaWithFallbackAsync<TSchema, TFallback>;

/**
 * Schema with maybe default async type.
 */
type SchemaWithMaybeDefaultAsync<TSchema extends BaseSchemaAsync = BaseSchemaAsync> = TSchema & {
    getDefault?: () => Promise<Output<TSchema>>;
};
/**
 * Returns the default value of the schema.
 *
 * @param schema The schema to get the default value from.
 *
 * @returns The default value.
 */
declare function getDefaultAsync<TSchema extends SchemaWithMaybeDefault | SchemaWithMaybeDefaultAsync>(schema: TSchema): Promise<DefaultValue<TSchema>>;

/**
 * Default value type.
 */
type DefaultValue<TSchema extends SchemaWithMaybeDefault | SchemaWithMaybeDefaultAsync> = TSchema['getDefault'] extends () => Output<TSchema> ? ReturnType<TSchema['getDefault']> : TSchema['getDefault'] extends () => Promise<Output<TSchema>> ? Awaited<ReturnType<TSchema['getDefault']>> : undefined;

/**
 * Schema with maybe default type.
 */
type SchemaWithMaybeDefault<TSchema extends BaseSchema = BaseSchema> = TSchema & {
    getDefault?: () => Output<TSchema>;
};
/**
 * Returns the default value of the schema.
 *
 * @param schema The schema to get the default value from.
 *
 * @returns The default value.
 */
declare function getDefault<TSchema extends SchemaWithMaybeDefault>(schema: TSchema): DefaultValue<TSchema>;

/**
 * Default values type.
 */
type DefaultValues<TSchema extends BaseSchema | BaseSchemaAsync> = TSchema extends OptionalSchema<any, infer TDefault> | OptionalSchemaAsync<any, infer TDefault> | NullableSchema<any, infer TDefault> | NullableSchemaAsync<any, infer TDefault> | NullishSchema<any, infer TDefault> | NullishSchemaAsync<any, infer TDefault> ? TDefault : TSchema extends ObjectSchema<infer TEntries extends ObjectEntries> ? {
    [TKey in keyof TEntries]: DefaultValues<TEntries[TKey]>;
} : TSchema extends ObjectSchemaAsync<infer TEntries extends ObjectEntriesAsync> ? {
    [TKey in keyof TEntries]: DefaultValues<TEntries[TKey]>;
} : TSchema extends TupleSchema<infer TItems> ? {
    [TKey in keyof TItems]: DefaultValues<TItems[TKey]>;
} : TSchema extends TupleSchemaAsync<infer TItems> ? {
    [TKey in keyof TItems]: DefaultValues<TItems[TKey]>;
} : undefined;

/**
 * Returns the default values of the schema.
 *
 * Hint: The difference to `getDefault` is that for objects and tuples without
 * an explicit default value, this function recursively returns the default
 * values of the subschemas instead of `undefined`.
 *
 * @param schema The schema to get the default values from.
 *
 * @returns The default values.
 */
declare function getDefaults<TSchema extends SchemaWithMaybeDefault<BaseSchema | ObjectSchema<ObjectEntries, any> | TupleSchema<TupleItems, any>>>(schema: TSchema): DefaultValues<TSchema>;

/**
 * Returns the default values of the schema.
 *
 * The difference to `getDefaultAsync` is that for objects and tuples without
 * an explicit default value, this function recursively returns the default
 * values of the subschemas instead of `undefined`.
 *
 * @param schema The schema to get the default values from.
 *
 * @returns The default values.
 */
declare function getDefaultsAsync<TSchema extends SchemaWithMaybeDefault<BaseSchema | ObjectSchema<ObjectEntries, any> | TupleSchema<TupleItems, any>> | SchemaWithMaybeDefaultAsync<BaseSchemaAsync | ObjectSchemaAsync<ObjectEntriesAsync, any> | TupleSchemaAsync<TupleItemsAsync, any>>>(schema: TSchema): Promise<DefaultValues<TSchema>>;

/**
 * Schema with maybe fallback async type.
 */
type SchemaWithMaybeFallbackAsync<TSchema extends BaseSchemaAsync = BaseSchemaAsync> = TSchema & {
    getFallback?: (info?: FallbackInfo) => Promise<Output<TSchema>>;
};
/**
 * Returns the fallback value of the schema.
 *
 * @param schema The schema to get the fallback value from.
 * @param info The fallback info.
 *
 * @returns The fallback value.
 */
declare function getFallbackAsync<TSchema extends SchemaWithMaybeFallback | SchemaWithMaybeFallbackAsync>(schema: TSchema, info?: FallbackInfo): Promise<FallbackValue<TSchema>>;

/**
 * Fallback value type.
 */
type FallbackValue<TSchema extends SchemaWithMaybeFallback | SchemaWithMaybeFallbackAsync> = TSchema extends SchemaWithFallback<BaseSchema, infer TFallback> | SchemaWithFallbackAsync<BaseSchemaAsync, infer TFallback> ? TFallback : undefined;

/**
 * Schema with maybe fallback type.
 */
type SchemaWithMaybeFallback<TSchema extends BaseSchema = BaseSchema> = TSchema & {
    getFallback?: (info?: FallbackInfo) => Output<TSchema>;
};
/**
 * Returns the fallback value of the schema.
 *
 * @param schema The schema to get the fallback value from.
 * @param info The fallback info.
 *
 * @returns The fallback value.
 */
declare function getFallback<TSchema extends SchemaWithMaybeFallback>(schema: TSchema, info?: FallbackInfo): FallbackValue<TSchema>;

/**
 * Fallback values type.
 */
type FallbackValues<TSchema extends SchemaWithMaybeFallback<BaseSchema | ObjectSchema<ObjectEntries, any> | TupleSchema<TupleItems, any>> | SchemaWithMaybeFallbackAsync<BaseSchemaAsync | ObjectSchemaAsync<ObjectEntriesAsync, any> | TupleSchemaAsync<TupleItemsAsync, any>>> = TSchema extends SchemaWithFallback<BaseSchema, infer TFallback> | SchemaWithFallbackAsync<BaseSchemaAsync, infer TFallback> ? TFallback : TSchema extends ObjectSchema<infer TEntries extends ObjectEntries> ? {
    [TKey in keyof TEntries]: FallbackValues<TEntries[TKey]>;
} : TSchema extends ObjectSchemaAsync<infer TEntries extends ObjectEntriesAsync> ? {
    [TKey in keyof TEntries]: FallbackValues<TEntries[TKey]>;
} : TSchema extends TupleSchema<infer TItems> ? {
    [TKey in keyof TItems]: FallbackValues<TItems[TKey]>;
} : TSchema extends TupleSchemaAsync<infer TItems> ? {
    [TKey in keyof TItems]: FallbackValues<TItems[TKey]>;
} : undefined;

/**
 * Returns the fallback values of the schema.
 *
 * Hint: The difference to `getFallback` is that for objects and tuples without
 * an explicit fallback value, this function recursively returns the fallback
 * values of the subschemas instead of `undefined`.
 *
 * @param schema The schema to get the fallback values from.
 *
 * @returns The fallback values.
 */
declare function getFallbacks<TSchema extends SchemaWithMaybeFallback<BaseSchema | ObjectSchema<ObjectEntries, any> | TupleSchema<TupleItems, any>>>(schema: TSchema): FallbackValues<TSchema>;

/**
 * Returns the fallback values of the schema.
 *
 * Hint: The difference to `getFallbackAsync` is that for objects and tuples
 * without an explicit fallback value, this function recursively returns the
 * fallback values of the subschemas instead of `undefined`.
 *
 * @param schema The schema to get the fallback values from.
 *
 * @returns The fallback values.
 */
declare function getFallbacksAsync<TSchema extends SchemaWithMaybeFallback<BaseSchema | ObjectSchema<ObjectEntries, any> | TupleSchema<TupleItems, any>> | SchemaWithMaybeFallbackAsync<BaseSchemaAsync | ObjectSchemaAsync<ObjectEntriesAsync, any> | TupleSchemaAsync<TupleItemsAsync, any>>>(schema: TSchema): Promise<FallbackValues<TSchema>>;

/**
 * Checks if the input matches the scheme. By using a type predicate, this
 * function can be used as a type guard.
 *
 * @param schema The schema to be used.
 * @param input The input to be tested.
 *
 * @returns Whether the input matches the scheme.
 */
declare function is<TSchema extends BaseSchema>(schema: TSchema, input: unknown): input is Input<TSchema>;

/**
 * Converts union to intersection types.
 */
type UnionToIntersection<T> = (T extends never ? never : (arg: T) => never) extends (arg: infer U) => never ? U : never;
/**
 * Converts union to tuple types.
 */
type UnionToTuple<T> = UnionToIntersection<T extends never ? never : () => T> extends () => infer W ? [...UnionToTuple<Exclude<T, W>>, W] : [];
/**
 * Returns a tuple or never type.
 */
type TupleOrNever<T> = T extends [string, ...string[]] ? T : never;
/**
 * Creates a enum schema of object keys.
 *
 * @param schema The object schema.
 *
 * @returns A enum schema.
 */
declare function keyof<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>>(schema: TSchema): PicklistSchema<TupleOrNever<UnionToTuple<keyof TSchema['entries']>>>;

/**
 * Merges objects types.
 */
type MergeObjects<TSchemas extends (ObjectSchema<any, any> | ObjectSchemaAsync<any, any>)[]> = TSchemas extends [infer TFirstSchema] ? TFirstSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any> ? TFirstSchema['entries'] : never : TSchemas extends [infer TFirstSchema, ...infer TRestSchemas] ? TFirstSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any> ? TRestSchemas extends (ObjectSchema<any, any> | ObjectSchemaAsync<any, any>)[] ? {
    [TKey in Exclude<keyof TFirstSchema['entries'], keyof MergeObjects<TRestSchemas>>]: TFirstSchema['entries'][TKey];
} & MergeObjects<TRestSchemas> : never : never : never;

/**
 * Object schemas type.
 */
type ObjectSchemas$1 = [
    ObjectSchema<any, any>,
    ObjectSchema<any, any>,
    ...ObjectSchema<any, any>[]
];
/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function merge<TSchemas extends ObjectSchemas$1>(schemas: TSchemas, pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, undefined>>): ObjectSchema<MergeObjects<TSchemas>>;
/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function merge<TSchemas extends ObjectSchemas$1>(schemas: TSchemas, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, undefined>>): ObjectSchema<MergeObjects<TSchemas>>;
/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function merge<TSchemas extends ObjectSchemas$1, TRest extends BaseSchema | undefined>(schemas: TSchemas, rest: TRest, pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>): ObjectSchema<MergeObjects<TSchemas>, TRest>;
/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function merge<TSchemas extends ObjectSchemas$1, TRest extends BaseSchema | undefined>(schemas: TSchemas, rest: TRest, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>): ObjectSchema<MergeObjects<TSchemas>, TRest>;

/**
 * Object schemas type.
 */
type ObjectSchemas = [
    ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
    ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
    ...(ObjectSchema<any, any> | ObjectSchemaAsync<any, any>)[]
];
/**
 * Merges the entries of multiple async object schemas. Subsequent object
 * entries overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function mergeAsync<TSchemas extends ObjectSchemas>(schemas: TSchemas, pipe?: PipeAsync<ObjectOutput<MergeObjects<TSchemas>, undefined>>): ObjectSchemaAsync<MergeObjects<TSchemas>>;
/**
 * Merges the entries of multiple async object schemas. Subsequent object
 * entries overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function mergeAsync<TSchemas extends ObjectSchemas>(schemas: TSchemas, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<MergeObjects<TSchemas>, undefined>>): ObjectSchemaAsync<MergeObjects<TSchemas>>;
/**
 * Merges the entries of multiple async object schemas. Subsequent object
 * entries overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function mergeAsync<TSchemas extends ObjectSchemas, TRest extends BaseSchema | BaseSchemaAsync | undefined>(schemas: TSchemas, rest: TRest, pipe?: PipeAsync<ObjectOutput<MergeObjects<TSchemas>, TRest>>): ObjectSchemaAsync<MergeObjects<TSchemas>, TRest>;
/**
 * Merges the entries of multiple async object schemas. Subsequent object
 * entries overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function mergeAsync<TSchemas extends ObjectSchemas, TRest extends BaseSchema | BaseSchemaAsync | undefined>(schemas: TSchemas, rest: TRest, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<MergeObjects<TSchemas>, TRest>>): ObjectSchemaAsync<MergeObjects<TSchemas>, TRest>;

/**
 * Object keys type.
 */
type ObjectKeys<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>> = [keyof TSchema['entries'], ...(keyof TSchema['entries'])[]];

/**
 * Creates an object schema that contains not the selected keys of an existing
 * schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function omit<TSchema extends ObjectSchema<any, any>, TKeys extends ObjectKeys<TSchema>>(schema: TSchema, keys: TKeys, pipe?: Pipe<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, undefined>>): ObjectSchema<Omit<TSchema['entries'], TKeys[number]>>;
/**
 * Creates an object schema that contains not the selected keys of an existing
 * schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function omit<TSchema extends ObjectSchema<any, any>, TKeys extends ObjectKeys<TSchema>>(schema: TSchema, keys: TKeys, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, undefined>>): ObjectSchema<Omit<TSchema['entries'], TKeys[number]>>;
/**
 * Creates an object schema that contains not the selected keys of an existing
 * schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function omit<TSchema extends ObjectSchema<any, any>, TKeys extends ObjectKeys<TSchema>, TRest extends BaseSchema | undefined>(schema: TSchema, keys: TKeys, rest: TRest, pipe?: Pipe<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, TRest>>): ObjectSchema<Omit<TSchema['entries'], TKeys[number]>, TRest>;
/**
 * Creates an object schema that contains not the selected keys of an existing
 * schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function omit<TSchema extends ObjectSchema<any, any>, TKeys extends ObjectKeys<TSchema>, TRest extends BaseSchema | undefined>(schema: TSchema, keys: TKeys, rest: TRest, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, TRest>>): ObjectSchema<Omit<TSchema['entries'], TKeys[number]>, TRest>;

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function omitAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TKeys extends ObjectKeys<TSchema>>(schema: TSchema, keys: TKeys, pipe?: PipeAsync<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, undefined>>): ObjectSchemaAsync<Omit<TSchema['entries'], TKeys[number]>>;
/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function omitAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TKeys extends ObjectKeys<TSchema>>(schema: TSchema, keys: TKeys, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, undefined>>): ObjectSchemaAsync<Omit<TSchema['entries'], TKeys[number]>>;
/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function omitAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TKeys extends ObjectKeys<TSchema>, TRest extends BaseSchema | BaseSchemaAsync | undefined>(schema: TSchema, keys: TKeys, rest: TRest, pipe?: PipeAsync<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, TRest>>): ObjectSchemaAsync<Omit<TSchema['entries'], TKeys[number]>, TRest>;
/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function omitAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TKeys extends ObjectKeys<TSchema>, TRest extends BaseSchema | BaseSchemaAsync | undefined>(schema: TSchema, keys: TKeys, rest: TRest, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, TRest>>): ObjectSchemaAsync<Omit<TSchema['entries'], TKeys[number]>, TRest>;

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param info The optional parse info.
 *
 * @returns The parsed output.
 */
declare function parse<TSchema extends BaseSchema>(schema: TSchema, input: unknown, info?: Pick<ParseInfo, 'abortEarly' | 'abortPipeEarly' | 'skipPipe'>): Output<TSchema>;

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param info The optional parse info.
 *
 * @returns The parsed output.
 */
declare function parseAsync<TSchema extends BaseSchema | BaseSchemaAsync>(schema: TSchema, input: unknown, info?: Pick<ParseInfo, 'abortEarly' | 'abortPipeEarly' | 'skipPipe'>): Promise<Output<TSchema>>;

/**
 * Partial object entries type.
 */
type PartialObjectEntries<TEntries extends ObjectEntries> = {
    [TKey in keyof TEntries]: OptionalSchema<TEntries[TKey]>;
};
/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function partial<TSchema extends ObjectSchema<any, any>>(schema: TSchema, pipe?: Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, undefined>>): ObjectSchema<PartialObjectEntries<TSchema['entries']>>;
/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function partial<TSchema extends ObjectSchema<any, any>>(schema: TSchema, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, undefined>>): ObjectSchema<PartialObjectEntries<TSchema['entries']>>;
/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function partial<TSchema extends ObjectSchema<any, any>, TRest extends BaseSchema | undefined>(schema: TSchema, rest: TRest, pipe?: Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, TRest>>): ObjectSchema<PartialObjectEntries<TSchema['entries']>, TRest>;
/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function partial<TSchema extends ObjectSchema<any, any>, TRest extends BaseSchema | undefined>(schema: TSchema, rest: TRest, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<PartialObjectEntries<TSchema['entries']>, TRest>>): ObjectSchema<PartialObjectEntries<TSchema['entries']>, TRest>;

/**
 * Partial object entries async type.
 */
type PartialObjectEntriesAsync<TEntries extends ObjectEntriesAsync> = {
    [TKey in keyof TEntries]: OptionalSchemaAsync<TEntries[TKey]>;
};
/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to optional.
 *
 * @param schema The affected schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function partialAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>>(schema: TSchema, pipe?: PipeAsync<ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, undefined>>): ObjectSchemaAsync<PartialObjectEntriesAsync<TSchema['entries']>>;
/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to optional.
 *
 * @param schema The affected schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function partialAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>>(schema: TSchema, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, undefined>>): ObjectSchemaAsync<PartialObjectEntriesAsync<TSchema['entries']>>;
/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function partialAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TRest extends BaseSchema | undefined>(schema: TSchema, rest: TRest, pipe?: PipeAsync<ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, TRest>>): ObjectSchemaAsync<PartialObjectEntriesAsync<TSchema['entries']>, TRest>;
/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function partialAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TRest extends BaseSchema | undefined>(schema: TSchema, rest: TRest, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, TRest>>): ObjectSchemaAsync<PartialObjectEntriesAsync<TSchema['entries']>, TRest>;

/**
 * Creates an object schema that passes unknown keys.
 *
 * @deprecated Use `object` with `rest` argument instead.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
declare function passthrough<TSchema extends ObjectSchema<ObjectEntries, undefined>>(schema: TSchema): TSchema;

/**
 * Creates an object schema that passes unknown keys.
 *
 * @deprecated Use `objectAsync` with `rest` argument instead.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
declare function passthroughAsync<TSchema extends ObjectSchemaAsync<ObjectEntriesAsync, undefined>>(schema: TSchema): TSchema;

/**
 * Creates an object schema that contains only the selected keys of an existing
 * schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function pick<TSchema extends ObjectSchema<any, any>, TKeys extends (keyof TSchema['entries'])[]>(schema: TSchema, keys: TKeys, pipe?: Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, undefined>>): ObjectSchema<Pick<TSchema['entries'], TKeys[number]>>;
/**
 * Creates an object schema that contains only the selected keys of an existing
 * schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function pick<TSchema extends ObjectSchema<any, any>, TKeys extends (keyof TSchema['entries'])[]>(schema: TSchema, keys: TKeys, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, undefined>>): ObjectSchema<Pick<TSchema['entries'], TKeys[number]>>;
/**
 * Creates an object schema that contains only the selected keys of an existing
 * schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function pick<TSchema extends ObjectSchema<any, any>, TKeys extends (keyof TSchema['entries'])[], TRest extends BaseSchema | undefined>(schema: TSchema, keys: TKeys, rest: TRest, pipe?: Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, TRest>>): ObjectSchema<Pick<TSchema['entries'], TKeys[number]>, TRest>;
/**
 * Creates an object schema that contains only the selected keys of an existing
 * schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function pick<TSchema extends ObjectSchema<any, any>, TKeys extends (keyof TSchema['entries'])[], TRest extends BaseSchema | undefined>(schema: TSchema, keys: TKeys, rest: TRest, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, TRest>>): ObjectSchema<Pick<TSchema['entries'], TKeys[number]>, TRest>;

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function pickAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TKeys extends (keyof TSchema['entries'])[]>(schema: TSchema, keys: TKeys, pipe?: PipeAsync<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, undefined>>): ObjectSchemaAsync<Pick<TSchema['entries'], TKeys[number]>>;
/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function pickAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TKeys extends (keyof TSchema['entries'])[]>(schema: TSchema, keys: TKeys, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, undefined>>): ObjectSchemaAsync<Pick<TSchema['entries'], TKeys[number]>>;
/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function pickAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TKeys extends (keyof TSchema['entries'])[], TRest extends BaseSchema | BaseSchemaAsync | undefined>(schema: TSchema, keys: TKeys, rest: TRest, pipe?: PipeAsync<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, TRest>>): ObjectSchemaAsync<Pick<TSchema['entries'], TKeys[number]>, TRest>;
/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function pickAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TKeys extends (keyof TSchema['entries'])[], TRest extends BaseSchema | BaseSchemaAsync | undefined>(schema: TSchema, keys: TKeys, rest: TRest, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, TRest>>): ObjectSchemaAsync<Pick<TSchema['entries'], TKeys[number]>, TRest>;

/**
 * Required object schema type.
 */
type Required$1<TEntries extends ObjectEntries> = {
    [TKey in keyof TEntries]: NonOptionalSchema<TEntries[TKey]>;
};
/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function required<TSchema extends ObjectSchema<any, any>>(schema: TSchema, pipe?: Pipe<ObjectOutput<Required$1<TSchema['entries']>, undefined>>): ObjectSchema<Required$1<TSchema['entries']>>;
/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function required<TSchema extends ObjectSchema<any, any>>(schema: TSchema, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<Required$1<TSchema['entries']>, undefined>>): ObjectSchema<Required$1<TSchema['entries']>>;
/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function required<TSchema extends ObjectSchema<any, any>, TRest extends BaseSchema | undefined>(schema: TSchema, rest: TRest, pipe?: Pipe<ObjectOutput<Required$1<TSchema['entries']>, TRest>>): ObjectSchema<Required$1<TSchema['entries']>, TRest>;
/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
declare function required<TSchema extends ObjectSchema<any, any>, TRest extends BaseSchema | undefined>(schema: TSchema, rest: TRest, error?: ErrorMessage, pipe?: Pipe<ObjectOutput<Required$1<TSchema['entries']>, TRest>>): ObjectSchema<Required$1<TSchema['entries']>, TRest>;

/**
 * Required object schema type.
 */
type Required<TEntries extends ObjectEntriesAsync> = {
    [TKey in keyof TEntries]: NonOptionalSchemaAsync<TEntries[TKey]>;
};
/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function requiredAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>>(schema: TSchema, pipe?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, undefined>>): ObjectSchemaAsync<Required<TSchema['entries']>>;
/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function requiredAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>>(schema: TSchema, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, undefined>>): ObjectSchemaAsync<Required<TSchema['entries']>>;
/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function requiredAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TRest extends BaseSchema | BaseSchemaAsync | undefined>(schema: TSchema, rest: TRest, pipe?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>): ObjectSchemaAsync<Required<TSchema['entries']>, TRest>;
/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
declare function requiredAsync<TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>, TRest extends BaseSchema | BaseSchemaAsync | undefined>(schema: TSchema, rest: TRest, error?: ErrorMessage, pipe?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>): ObjectSchemaAsync<Required<TSchema['entries']>, TRest>;

/**
 * Safe parse result type.
 */
type SafeParseResult<TSchema extends BaseSchema | BaseSchemaAsync> = {
    success: true;
    /**
     * @deprecated Please use `.output` instead.
     */
    data: Output<TSchema>;
    output: Output<TSchema>;
} | {
    success: false;
    /**
     * @deprecated Please use `.issues` instead.
     */
    error: ValiError;
    issues: Issues;
};

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param info The optional parse info.
 *
 * @returns The parsed output.
 */
declare function safeParse<TSchema extends BaseSchema>(schema: TSchema, input: unknown, info?: Pick<ParseInfo, 'abortEarly' | 'abortPipeEarly' | 'skipPipe'>): SafeParseResult<TSchema>;

/**
 * Parses unknown input based on a schema.
 *
 * @param schema The schema to be used.
 * @param input The input to be parsed.
 * @param info The optional parse info.
 *
 * @returns The parsed output.
 */
declare function safeParseAsync<TSchema extends BaseSchema | BaseSchemaAsync>(schema: TSchema, input: unknown, info?: Pick<ParseInfo, 'abortEarly' | 'abortPipeEarly' | 'skipPipe'>): Promise<SafeParseResult<TSchema>>;

/**
 * Creates a strict object schema that throws an error if an input contains
 * unknown keys.
 *
 * @deprecated Use `object` with `rest` argument instead.
 *
 * @param schema A object schema.
 * @param error The error message.
 *
 * @returns A strict object schema.
 */
declare function strict<TSchema extends ObjectSchema<ObjectEntries, undefined>>(schema: TSchema, error?: ErrorMessage): TSchema;

/**
 * Creates a strict async object schema that throws an error if an input
 * contains unknown keys.
 *
 * @deprecated Use `objectAsync` with `rest` argument instead.
 *
 * @param schema A object schema.
 * @param error The error message.
 *
 * @returns A strict object schema.
 */
declare function strictAsync<TSchema extends ObjectSchemaAsync<ObjectEntriesAsync, undefined>>(schema: TSchema, error?: ErrorMessage): TSchema;

/**
 * Creates an object schema that strips unknown keys.
 *
 * @deprecated Use `object` without `rest` argument instead.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
declare function strip<TSchema extends ObjectSchema<ObjectEntries, undefined>>(schema: TSchema): TSchema;

/**
 * Creates an object schema that strips unknown keys.
 *
 * @deprecated Use `objectAsync` without `rest` argument instead.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
declare function stripAsync<TSchema extends ObjectSchemaAsync<ObjectEntriesAsync, undefined>>(schema: TSchema): TSchema;

/**
 * Schema with transform type.
 */
type SchemaWithTransform<TSchema extends BaseSchema, TOutput> = Omit<TSchema, '_types'> & {
    _types?: {
        input: Input<TSchema>;
        output: TOutput;
    };
};
/**
 * Adds a transformation step to a schema, which is executed at the end of
 * parsing and can change the output type.
 *
 * @param schema The schema to be used.
 * @param action The transformation action.
 * @param pipe A validation pipe.
 *
 * @returns A transformed schema.
 */
declare function transform<TSchema extends BaseSchema, TOutput>(schema: TSchema, action: (value: Output<TSchema>) => TOutput, pipe?: Pipe<TOutput>): SchemaWithTransform<TSchema, TOutput>;
/**
 * Adds a transformation step to a schema, which is executed at the end of
 * parsing and can change the output type.
 *
 * @param schema The schema to be used.
 * @param action The transformation action.
 * @param validate A validation schema.
 *
 * @returns A transformed schema.
 */
declare function transform<TSchema extends BaseSchema, TOutput>(schema: TSchema, action: (value: Output<TSchema>) => TOutput, validate?: BaseSchema<TOutput>): SchemaWithTransform<TSchema, TOutput>;

/**
 * Schema with transform async type.
 */
type SchemaWithTransformAsync<TSchema extends BaseSchema | BaseSchemaAsync, TOutput> = Omit<TSchema, 'async' | '_parse' | '_types'> & {
    async: true;
    _parse(input: unknown, info?: ParseInfo): Promise<_ParseResult<TOutput>>;
    _types?: {
        input: Input<TSchema>;
        output: TOutput;
    };
};
/**
 * Adds an async transformation step to a schema, which is executed at the end
 * of parsing and can change the output type.
 *
 * @param schema The schema to be used.
 * @param action The transformation action.
 * @param pipe A validation pipe.
 *
 * @returns A transformed schema.
 */
declare function transformAsync<TSchema extends BaseSchema | BaseSchemaAsync, TOutput>(schema: TSchema, action: (value: Output<TSchema>) => TOutput | Promise<TOutput>, pipe?: PipeAsync<TOutput>): SchemaWithTransformAsync<TSchema, TOutput>;
/**
 * Adds an async transformation step to a schema, which is executed at the end
 * of parsing and can change the output type.
 *
 * @param schema The schema to be used.
 * @param action The transformation action.
 * @param validate A validation schema.
 *
 * @returns A transformed schema.
 */
declare function transformAsync<TSchema extends BaseSchema | BaseSchemaAsync, TOutput>(schema: TSchema, action: (value: Output<TSchema>) => TOutput | Promise<TOutput>, validate?: BaseSchema<TOutput> | BaseSchemaAsync<TOutput>): SchemaWithTransformAsync<TSchema, TOutput>;

/**
 * Unwraps the wrapped schema.
 *
 * @param schema The schema to be unwrapped.
 *
 * @returns The unwrapped schema.
 */
declare function unwrap<TSchema extends OptionalSchema<any, any> | OptionalSchemaAsync<any, any> | NullableSchema<any, any> | NullableSchemaAsync<any, any> | NullishSchema<any, any> | NullishSchemaAsync<any, any> | NonOptionalSchema<any> | NonOptionalSchemaAsync<any> | NonNullableSchema<any> | NonNullableSchemaAsync<any> | NonNullishSchema<any> | NonNullishSchemaAsync<any>>(schema: TSchema): TSchema['wrapped'];

/**
 * Passes a default value to a schema in case of an undefined input.
 *
 * @deprecated Use `optional` instead.
 *
 * @param schema The affected schema.
 * @param value The default value.
 *
 * @returns The passed schema.
 */
declare function withDefault<TSchema extends BaseSchema | BaseSchemaAsync>(schema: TSchema, value: Input<TSchema> | (() => Input<TSchema>)): TSchema;
/**
 * See {@link withDefault}
 *
 * @deprecated Use `optional` instead.
 */
declare const useDefault: typeof withDefault;

/**
 * [cuid2](https://github.com/paralleldrive/cuid2#cuid2) regex.
 */
declare const CUID2_REGEX: RegExp;
/**
 * Email regex.
 */
declare const EMAIL_REGEX: RegExp;
/**
 * Emoji regex.
 */
declare const EMOJI_REGEX: RegExp;
/**
 * [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) regex.
 */
declare const IMEI_REGEX: RegExp;
/**
 * [IPv4](https://en.wikipedia.org/wiki/IPv4) regex.
 */
declare const IPV4_REGEX: RegExp;
/**
 * [IPv6](https://en.wikipedia.org/wiki/IPv6) regex.
 */
declare const IPV6_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date regex.
 */
declare const ISO_DATE_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date-time regex.
 */
declare const ISO_DATE_TIME_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time regex.
 */
declare const ISO_TIME_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) time with seconds regex.
 */
declare const ISO_TIME_SECOND_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp regex.
 */
declare const ISO_TIMESTAMP_REGEX: RegExp;
/**
 * [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) week regex.
 */
declare const ISO_WEEK_REGEX: RegExp;
/**
 * [ULID](https://github.com/ulid/spec) regex.
 */
declare const ULID_REGEX: RegExp;
/**
 * [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) regex.
 */
declare const UUID_REGEX: RegExp;

/**
 * Creates a custom transformation function.
 *
 * @param action The transform action.
 *
 * @returns A transformation function.
 */
declare function toCustom<TInput>(action: (input: TInput) => TInput): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a async custom transformation function.
 *
 * @param action The transform action.
 *
 * @returns A async transformation function.
 */
declare function toCustomAsync<TInput>(action: (input: TInput) => TInput | Promise<TInput>): (input: TInput) => Promise<PipeResult<TInput>>;

/**
 * Creates a transformation function that converts all the alphabetic
 * characters in a string to lowercase.
 *
 * @returns A transformation function.
 */
declare function toLowerCase(): (input: string) => PipeResult<string>;

/**
 * Creates a transformation function that sets a string, number or date to a
 * maximum value.
 *
 * @param requirement The maximum value.
 *
 * @returns A transformation function.
 */
declare function toMaxValue<TInput extends string | number | bigint | Date, TRequirement extends TInput>(requirement: TRequirement): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a transformation function that sets a string, number or date to a
 * minimum value.
 *
 * @param requirement The minimum value.
 *
 * @returns A transformation function.
 */
declare function toMinValue<TInput extends string | number | bigint | Date, TRequirement extends TInput>(requirement: TRequirement): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a transformation function that removes the leading and trailing
 * white space and line terminator characters from a string.
 *
 * @returns A transformation function.
 */
declare function toTrimmed(): (input: string) => PipeResult<string>;

/**
 * Creates a transformation function that removes the trailing white space and
 * line terminator characters from a string.
 *
 * @returns A transformation function.
 */
declare function toTrimmedEnd(): (input: string) => PipeResult<string>;

/**
 * Creates a transformation function that removes the leading white space and
 * line terminator characters from a string.
 *
 * @returns A transformation function.
 */
declare function toTrimmedStart(): (input: string) => PipeResult<string>;

/**
 * Creates a transformation function that converts all the alphabetic
 * characters in a string to uppercase.
 *
 * @returns A transformation function.
 */
declare function toUpperCase(): (input: string) => PipeResult<string>;

/**
 * Executes the validation and transformation pipe.
 *
 * @param input The input value.
 * @param pipe The pipe to be executed.
 * @param info The validation info.
 *
 * @returns The output value.
 */
declare function executePipe<TValue>(input: TValue, pipe: Pipe<TValue> | undefined, parseInfo: ParseInfo | undefined, reason: IssueReason): _ParseResult<TValue>;

/**
 * Executes the async validation and transformation pipe.
 *
 * @param input The input value.
 * @param pipe The pipe to be executed.
 * @param info The validation info.
 *
 * @returns The output value.
 */
declare function executePipeAsync<TValue>(input: TValue, pipe: PipeAsync<TValue> | undefined, parseInfo: ParseInfo | undefined, reason: IssueReason): Promise<_ParseResult<TValue>>;

/**
 * Returns error and pipe from dynamic arguments.
 *
 * @param arg1 First argument.
 * @param arg2 Second argument.
 *
 * @returns The default arguments.
 */
declare function getDefaultArgs<TPipe extends Pipe<any> | PipeAsync<any>>(arg1: ErrorMessage | TPipe | undefined, arg2: TPipe | undefined): [ErrorMessage | undefined, TPipe | undefined];

/**
 * Returns the result object with issues.
 *
 * @param issues The issues.
 *
 * @returns The result object.
 */
declare function getIssues<TIssues>(issues: TIssues): {
    issues: TIssues;
};

/**
 * Returns the result object with an output.
 *
 * @param output The output value.
 *
 * @returns The result object.
 */
declare function getOutput<TOutput>(output: TOutput): {
    output: TOutput;
};

/**
 * Returns the pipeline result object with issues.
 *
 * @param validation The validation name.
 * @param error The error message.
 * @param input The input value.
 *
 * @returns The pipeline result object.
 */
declare function getPipeIssues(validation: string, error: ErrorMessage, input: unknown): {
    issues: Pick<Issue, 'validation' | 'message' | 'input' | 'path'>[];
};

/**
 * Returns rest, error and pipe from dynamic arguments.
 *
 * @param arg1 First argument.
 * @param arg2 Second argument.
 * @param arg3 Third argument.
 *
 * @returns The tuple arguments.
 */
declare function getRestAndDefaultArgs<TRest extends BaseSchema | BaseSchemaAsync | undefined, TPipe extends Pipe<any> | PipeAsync<any>>(arg1: TPipe | ErrorMessage | TRest | undefined, arg2: TPipe | ErrorMessage | undefined, arg3: TPipe | undefined): [TRest, ErrorMessage | undefined, TPipe | undefined];

/**
 * Returns the schema result object with issues.
 *
 * @param info The parse info.
 * @param reason The issue reason.
 * @param validation The validation name.
 * @param error The error message.
 * @param input The input value.
 * @param issues The sub issues.
 *
 * @returns The schema result object.
 */
declare function getSchemaIssues(info: ParseInfo | undefined, reason: IssueReason, validation: string, error: ErrorMessage, input: unknown, issues?: Issues): {
    issues: Issues;
};

/**
 * Checks whether a string with numbers corresponds to the luhn algorithm.
 *
 * @param input The input to be checked.
 *
 * @returns Whether input is valid.
 */
declare function isLuhnAlgo(input: string): boolean;

/**
 * Creates a validation function that validates the byte length of a string.
 *
 * @param requirement The byte length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function bytes<TInput extends string>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates a [cuid2](https://github.com/paralleldrive/cuid2#cuid2).
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function cuid2<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a custom validation function.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function custom<TInput>(requirement: (input: TInput) => boolean, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a async custom validation function.
 *
 * @param requirement The async validation function.
 * @param error The error message.
 *
 * @returns A async validation function.
 */
declare function customAsync<TInput>(requirement: (input: TInput) => Promise<boolean>, error?: ErrorMessage): (input: TInput) => Promise<PipeResult<TInput>>;

/**
 * Creates a validation function that validates a email.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function email<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates an emoji.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function emoji<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the end of a string.
 *
 * @param requirement The end string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function endsWith<TInput extends string>(requirement: string, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that checks the value for equality.
 *
 * @deprecated Function has been renamed to `value`.
 *
 * @param requirement The required value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function equal<TInput extends string | number | bigint | boolean, TRequirement extends TInput>(requirement: TRequirement, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

declare function excludes<TInput extends string>(requirement: string, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;
declare function excludes<TInput extends TItem[], TItem>(requirement: TItem, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates whether a number is finite.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function finite<TInput extends number>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates an [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity).
 *
 * Format: AA-BBBBBB-CCCCCC-D
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function imei<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

declare function includes<TInput extends string>(requirement: string, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;
declare function includes<TInput extends TItem[], TItem>(requirement: TItem, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates whether a number is an integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function integer<TInput extends number>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates an [IPv4](https://en.wikipedia.org/wiki/IPv4)
 * or [IPv6](https://en.wikipedia.org/wiki/IPv6) address.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function ip<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates an IP v4 address.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function ipv4<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates an IP v6 address.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function ipv6<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates a date.
 *
 * Format: yyyy-mm-dd
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31" is valid although June has only
 * 30 days.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function isoDate<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates a datetime.
 *
 * Format: yyyy-mm-ddThh:mm
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00" is valid although June has only
 * 30 days.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function isoDateTime<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates a time.
 *
 * Format: hh:mm
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function isoTime<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates a time with seconds.
 *
 * Format: hh:mm:ss
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function isoTimeSecond<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates a timestamp.
 *
 * Format: yyyy-mm-ddThh:mm:ss.sssZ
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31T00:00:00.000Z" is valid although
 * June has only 30 days.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function isoTimestamp<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates a week.
 *
 * Format: yyyy-Www
 *
 * Hint: The regex used cannot validate the maximum number of weeks based on
 * the year. For example, "2021W53" is valid even though the year 2021 has only
 * 52 weeks.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function isoWeek<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the length of a string or array.
 *
 * @param requirement The length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function length<TInput extends string | any[]>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the byte length of a string.
 *
 * @param requirement The maximum length in byte.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function maxBytes<TInput extends string>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the length of a string or array.
 *
 * @param requirement The maximum length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function maxLength<TInput extends string | any[]>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the size of a map, set or blob.
 *
 * @param requirement The maximum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function maxSize<TInput extends Map<any, any> | Set<any> | Blob>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the value of a string, number or date.
 *
 * @param requirement The maximum value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function maxValue<TInput extends string | number | bigint | Date, TRequirement extends TInput>(requirement: TRequirement, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;
/**
 * See {@link maxValue}
 *
 * @deprecated Function has been renamed to `maxValue`.
 */
declare const maxRange: typeof maxValue;

/**
 * Creates a validation function that validates the byte length of a string.
 *
 * @param requirement The minimum length in byte.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function minBytes<TInput extends string>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the MIME type of a file.
 *
 * @param requirement The MIME types.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function mimeType<TInput extends Blob>(requirement: `${string}/${string}`[], error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the length of a string or array.
 *
 * @param requirement The minimum length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function minLength<TInput extends string | any[]>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the size of a map, set or blob.
 *
 * @param requirement The minimum size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function minSize<TInput extends Map<any, any> | Set<any> | Blob>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the value of a string, number or date.
 *
 * @param requirement The minimum value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function minValue<TInput extends string | number | bigint | Date, TRequirement extends TInput>(requirement: TRequirement, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;
/**
 * See {@link minValue}
 *
 * @deprecated Function has been renamed to `minValue`.
 */
declare const minRange: typeof minValue;

/**
 * Creates a validation function that validates whether a number is a multiple.
 *
 * @param requirement The divisor.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function multipleOf<TInput extends number>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the byte length of a string.
 *
 * @param requirement The byte length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function notBytes<TInput extends string>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the length of a string or array.
 *
 * @param requirement The length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function notLength<TInput extends string | any[]>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the size of a map, set or blob.
 *
 * @param requirement The size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function notSize<TInput extends Map<any, any> | Set<any> | Blob>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the value of a string or number.
 *
 * @param requirement The value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function notValue<TInput extends string | number | bigint, TRequirement extends TInput>(requirement: TRequirement, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates a string with a regex.
 *
 * @param requirement The regex pattern.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function regex<TInput extends string>(requirement: RegExp, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates whether a number is a safe integer.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function safeInteger<TInput extends number>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the size of a map, set or blob.
 *
 * @param requirement The size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function size<TInput extends Map<any, any> | Set<any> | Blob>(requirement: number, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the start of a string.
 *
 * @param requirement The start string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function startsWith<TInput extends string>(requirement: string, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates a [ULID](https://github.com/ulid/spec).
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function ulid<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates a URL.
 *
 * Hint: The value is passed to the URL constructor to check if it is valid.
 * This check is not perfect. For example, values like "abc:1234" are accepted.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function url<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function uuid<TInput extends string>(error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the value of a string or number.
 *
 * @param requirement The value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
declare function value<TInput extends string | number | bigint, TRequirement extends TInput>(requirement: TRequirement, error?: ErrorMessage): (input: TInput) => PipeResult<TInput>;

export { AnySchema, AnySchemaAsync, ArrayPathItem, ArraySchema, ArraySchemaAsync, BaseSchema, BaseSchemaAsync, BigintSchema, BigintSchemaAsync, BlobSchema, BlobSchemaAsync, BooleanSchema, BooleanSchemaAsync, Brand, BrandName, BrandSymbol, CUID2_REGEX, Class, DateSchema, DateSchemaAsync, DefaultValue, DefaultValues, EMAIL_REGEX, EMOJI_REGEX, Enum, EnumSchema, EnumSchemaAsync, ErrorMessage, FallbackInfo, FallbackValue, FallbackValues, FlatErrors, IMEI_REGEX, IPV4_REGEX, IPV6_REGEX, ISO_DATE_REGEX, ISO_DATE_TIME_REGEX, ISO_TIMESTAMP_REGEX, ISO_TIME_REGEX, ISO_TIME_SECOND_REGEX, ISO_WEEK_REGEX, Input, InstanceSchema, InstanceSchemaAsync, IntersectOptions, IntersectSchema, Issue, IssueOrigin, IssueReason, Issues, Literal, LiteralSchema, LiteralSchemaAsync, MapInput, MapOutput, MapPathItem, MapSchema, MapSchemaAsync, NanSchema, NanSchemaAsync, NeverSchema, NeverSchemaAsync, NonNullable$1 as NonNullable, NonNullableSchema, NonNullableSchemaAsync, NonNullish, NonNullishSchema, NonNullishSchemaAsync, NonOptional, NonOptionalSchema, NonOptionalSchemaAsync, NullSchema, NullSchemaAsync, NullableSchema, NullableSchemaAsync, NullishSchema, NullishSchemaAsync, NumberSchema, NumberSchemaAsync, ObjectEntries, ObjectEntriesAsync, ObjectInput, ObjectOutput, ObjectPathItem, ObjectSchema, ObjectSchemaAsync, OptionalSchema, OptionalSchemaAsync, Output, ParseInfo, PartialObjectEntries, PartialObjectEntriesAsync, PathItem, PicklistOptions, PicklistSchema, PicklistSchemaAsync, Pipe, PipeAsync, PipeInfo, PipeResult, RecordInput, RecordKey, RecordKeyAsync, RecordOutput, RecordPathItem, RecordSchema, RecordSchemaAsync, RecursiveSchema, RecursiveSchemaAsync, ResolveObject, SafeParseResult, SchemaWithBrand, SchemaWithFallback, SchemaWithFallbackAsync, SchemaWithMaybeDefault, SchemaWithMaybeDefaultAsync, SchemaWithMaybeFallback, SchemaWithMaybeFallbackAsync, SchemaWithTransform, SchemaWithTransformAsync, SetInput, SetOutput, SetPathItem, SetSchema, SetSchemaAsync, SpecialSchema, SpecialSchemaAsync, StringSchema, StringSchemaAsync, SymbolSchema, SymbolSchemaAsync, TupleInput, TupleItems, TupleItemsAsync, TupleOutput, TuplePathItem, TupleSchema, TupleSchemaAsync, ULID_REGEX, UUID_REGEX, UndefinedSchema, UndefinedSchemaAsync, UnionOptions, UnionOptionsAsync, UnionSchema, UnionSchemaAsync, UnknownSchema, UnknownSchemaAsync, ValiError, VariantOption, VariantOptionAsync, VariantOptions, VariantOptionsAsync, VariantSchema, VariantSchemaAsync, VoidSchema, VoidSchemaAsync, _ParseResult, any, anyAsync, array, arrayAsync, bigint, bigintAsync, blob, blobAsync, boolean, booleanAsync, brand, bytes, coerce, coerceAsync, cuid2, custom, customAsync, date, dateAsync, discriminatedUnion, discriminatedUnionAsync, email, emoji, endsWith, enumAsync, enumType, enumTypeAsync, enum_, equal, excludes, executePipe, executePipeAsync, fallback, fallbackAsync, finite, flatten, getDefault, getDefaultArgs, getDefaultAsync, getDefaults, getDefaultsAsync, getFallback, getFallbackAsync, getFallbacks, getFallbacksAsync, getIssues, getOutput, getPipeIssues, getRestAndDefaultArgs, getSchemaIssues, imei, includes, instance, instanceAsync, integer, intersect, intersection, ip, ipv4, ipv6, is, isLuhnAlgo, isoDate, isoDateTime, isoTime, isoTimeSecond, isoTimestamp, isoWeek, keyof, length, literal, literalAsync, map, mapAsync, maxBytes, maxLength, maxRange, maxSize, maxValue, merge, mergeAsync, mimeType, minBytes, minLength, minRange, minSize, minValue, multipleOf, nan, nanAsync, nativeEnum, nativeEnumAsync, never, neverAsync, nonNullable, nonNullableAsync, nonNullish, nonNullishAsync, nonOptional, nonOptionalAsync, notBytes, notLength, notSize, notValue, nullAsync, nullType, nullTypeAsync, null_, nullable, nullableAsync, nullish, nullishAsync, number, numberAsync, object, objectAsync, omit, omitAsync, optional, optionalAsync, parse, parseAsync, partial, partialAsync, passthrough, passthroughAsync, pick, pickAsync, picklist, picklistAsync, record, recordAsync, recursive, recursiveAsync, regex, required, requiredAsync, safeInteger, safeParse, safeParseAsync, set, setAsync, size, special, specialAsync, startsWith, strict, strictAsync, string, stringAsync, strip, stripAsync, symbol, symbolAsync, toCustom, toCustomAsync, toLowerCase, toMaxValue, toMinValue, toTrimmed, toTrimmedEnd, toTrimmedStart, toUpperCase, transform, transformAsync, tuple, tupleAsync, ulid, undefinedAsync, undefinedType, undefinedTypeAsync, undefined_, union, unionAsync, unknown, unknownAsync, unwrap, url, useDefault, uuid, value, variant, variantAsync, voidAsync, voidType, voidTypeAsync, void_, withDefault };
