type NonNullableProperties<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};
export const removeNullAndUndefinedFields = <
    T extends Record<string, any>,
>(
    data: T,
): NonNullableProperties<T> => {
    const filledObject: NonNullableProperties<T> = {} as NonNullableProperties<
        T
    >;

    for (const [key, value] of Object.entries(data)) {
        if (value != null && value != undefined && !isNaN(value)) {
            filledObject[key as keyof T] = value;
        }
    }
    return filledObject;
};
