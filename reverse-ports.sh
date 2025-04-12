

# Các port cần reverse từ điện thoại -> laptop
PORTS=(3000 8081 8082)

echo "🚀 Đang reverse các port qua adb..."

for PORT in "${PORTS[@]}"
do
  echo "➡️  adb reverse tcp:$PORT tcp:$PORT"
  adb reverse tcp:$PORT tcp:$PORT
done

echo "✅ Hoàn tất reverse port!"
