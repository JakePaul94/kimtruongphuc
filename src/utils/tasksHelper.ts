export const getStatusBgClass = (status: string): string => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-400';
        case 'in_process':
            return 'bg-blue-500';
        case 'completed':
            return 'bg-green-500';
        case 'canceled':
            return 'bg-gray-500';
        default:
            return 'bg-gray-300';
    }
};
export const getStatusText = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Chờ xử lý';
        case 'in_process':
            return 'Đang xử lý';
        case 'completed':
            return 'Hoàn thành';
        case 'canceled':
            return 'Thất bại';
        default:
            return status;
    }
};