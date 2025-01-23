import { InboxIcon, CheckIcon } from '@heroicons/react/24/outline';

export const DEFAULT_ALL_FILTERS = [
    {
        name: 'All Open Conversations',
        label: 'Open',
        icon: InboxIcon,
        query: {
            status: 'open'
        },
    },
    {
        name: 'All Closed Conversations',
        label: 'Closed',
        icon: CheckIcon,
        query: {
            status: 'closed'
        },
    }
];

export const DEFAULT_ASSIGNED_TO_ME_FILTERS = (sessionId: string) => {
    return [
        {
            name: 'My Open Conversations',
            label: 'Open',
            icon: InboxIcon,
            query: {
                status: 'open',
                assigned_to: sessionId
            },
        },
        {
            name: 'My Closed Conversations',
            label: 'Closed',
            icon: CheckIcon,
            query: {
                status: 'closed',
                assigned_to: sessionId
            },
        }
    ];
};