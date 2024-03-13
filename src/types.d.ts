interface BaseComponent {
    render: () => Promise<string>;
    title?: string;
}