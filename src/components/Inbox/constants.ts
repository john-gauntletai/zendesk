
export const DEFAULT_ALL_FILTERS = [
    {
        label: '📬 Open',
        query: {
            status: 'open'
        },
    },
    {
        label: '✅ Closed',
        query: {
            status: 'closed'
        },
    }
];

export const DEFAULT_ASSIGNED_TO_ME_FILTERS = (sessionId: string) => {
    return [
        {
            label: '✋ Open',
            query: {
                status: 'open',
                assigned_to: sessionId
            },
        },
        {
            label: '✅ Closed',
            query: {
                status: 'closed',
                assigned_to: sessionId
            },
        }
    ];
};