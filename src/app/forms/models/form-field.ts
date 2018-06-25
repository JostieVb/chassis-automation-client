export class FormField {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public type: string,
        public required: boolean,
        public showToolbar?: boolean
    ) {}
}
