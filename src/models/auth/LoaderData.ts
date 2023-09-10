export class LoaderData<T> {
    constructor(
        public readonly jwt: string | undefined,
        public readonly data: T | undefined
    ) {}
}