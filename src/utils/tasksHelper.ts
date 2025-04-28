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
export const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-blue-500'; // Màu xanh cho Hoàn thành
      case 'pending':
        return 'text-yellow-500'; // Màu vàng cho Chờ xử lý
      case 'in_process':
        return 'text-blue-500'; // Màu xanh dương cho Đang xử lý
      case 'canceled':
        return 'text-red-500'; // Màu đỏ cho Hủy bỏ
      default:
        return 'text-green-500';
    }
  };