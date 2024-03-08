export declare class Days implements BaseComponent {
    private fromDate;
    private toDate;
    constructor(fromDate: Date, toDate: Date);
    render(): Promise<string>;
}
