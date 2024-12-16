let map; // Định nghĩa biến map ở cấp độ toàn cục
let currentMarker; // Biến để lưu marker hiện tại
let restaurantMarkers = []; // Mảng để lưu các marker đã có thông tin nhà hàng
const addressInput = document.getElementById("address-search"); // Định nghĩa biến ở đây
// Gán biến cho API Token
const mapboxToken =
  "sk.eyJ1IjoidHZoaWV1MjI3IiwiYSI6ImNtNHA5dHJpaTBtb2Iya3FxaGQ2Y3Y3YWEifQ.GL-ACRxZqWD8z6U9a-_gVg"; // Thay YOUR_MAPBOX_ACCESS_TOKEN bằng token của bạn

function initMap() {
  map = L.map("map").setView([21.0285, 105.8542], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Thêm sự kiện nhấp chuột để lấy tọa độ
  map.on("click", function (e) {
    const { lat, lng } = e.latlng;
    addMarker(lat, lng); // Chỉ thêm marker mới nếu chưa có marker nào
  });

  // Thêm sự kiện cho thanh tìm kiếm địa chỉ
  const addressInput = document.getElementById("address-search");
  addressInput.addEventListener("input", () => {
    const query = addressInput.value;
    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      document.getElementById("suggestions").style.display = "none"; // Ẩn gợi ý nếu không đủ ký tự
    }
  });

  // Thêm sự kiện cho nút tìm kiếm địa chỉ
  document.getElementById("search-address").onclick = () => {
    const address = addressInput.value;
    searchAddress(address);
  };
}

// Hàm tìm kiếm gợi ý địa chỉ
function fetchSuggestions(query) {
  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${mapboxToken}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const suggestions = document.getElementById("suggestions");
      suggestions.innerHTML = ""; // Xóa gợi ý cũ
      if (data.features.length > 0) {
        suggestions.style.display = "block"; // Hiện gợi ý
        data.features.forEach((item) => {
          const li = document.createElement("li");
          li.className = "list-group-item list-group-item-action";
          li.textContent = item.place_name; // Hiển thị tên địa điểm
          li.onclick = () => {
            addressInput.value = item.place_name; // Gán giá trị cho input
            suggestions.style.display = "none"; // Ẩn gợi ý sau khi chọn
            addMarker(
              item.geometry.coordinates[1],
              item.geometry.coordinates[0]
            ); // Thêm marker tại vị trí gợi ý
            map.setView(
              [item.geometry.coordinates[1], item.geometry.coordinates[0]],
              13
            ); // Di chuyển bản đồ đến vị trí gợi ý
          };
          suggestions.appendChild(li);
        });
      } else {
        suggestions.style.display = "none"; // Ẩn gợi ý nếu không có kết quả
      }
    })
    .catch((error) => {
      console.error("Lỗi khi lấy gợi ý địa chỉ:", error);
      alert("Có lỗi xảy ra khi tìm kiếm gợi ý địa chỉ.");
    });
}
function getAddress(lat, lng) {
  fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data && data.display_name) {
        alert(`Địa chỉ: ${data.display_name}`);
      }
    })
    .catch((error) => {
      console.error("Lỗi khi lấy địa chỉ:", error);
    });
}

// Hàm thêm marker
function addMarker(lat, lng) {
  // Nếu có marker hiện tại, xóa nó
  if (currentMarker) {
    map.removeLayer(currentMarker); // Xóa marker cũ
  }

  // Tạo marker mới
  currentMarker = L.marker([lat, lng]).addTo(map);
  currentMarker.bindPopup(`Tọa độ: ${lat}, ${lng}`).openPopup();

  // Lưu marker vào mảng
  restaurantMarkers.push(currentMarker);
}

// Hàm tìm kiếm địa chỉ
// Giả sử bạn đã có một element với id là 'result' để hiển thị kết quả tìm kiếm

function searchAddress(query) {
  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${mapboxToken}&country=vn&language=vi&bbox=102,8,110,24&types=address&limit=5`
  )
    .then((response) => response.json())
    .then((data) => {
      const resultsElement = document.getElementById("results");
      resultsElement.innerHTML = "";

      if (data.features.length > 0) {
        data.features.forEach((feature) => {
          const placeName = feature.place_name;
          const context = feature.context;

          // Tìm các thành phần địa chỉ chi tiết hơn từ context
          const district = context.find((item) =>
            item.id.startsWith("district")
          );
          const city = context.find((item) => item.id.startsWith("locality"));
          const country = context.find((item) => item.id.startsWith("country"));

          const resultItem = document.createElement("li");
          resultItem.textContent = `${placeName} (${
            district ? district.text : ""
          }, ${city ? city.text : ""}, ${country ? country.text : ""})`;
          resultsElement.appendChild(resultItem);

          // Thêm sự kiện click để hiển thị marker trên bản đồ hoặc thực hiện các hành động khác
          resultItem.addEventListener("click", () => {
            const coordinates = feature.geometry.coordinates;
            // Thêm marker vào bản đồ, ...
          });
        });
      } else {
        resultsElement.textContent = "Không tìm thấy kết quả";
      }
    })
    .catch((error) => {
      console.error("Lỗi khi tìm kiếm địa chỉ:", error);
      resultsElement.textContent = "Có lỗi xảy ra khi tìm kiếm.";
    });
}

// Khởi tạo bản đồ khi tài liệu đã tải xong
document.addEventListener("DOMContentLoaded", initMap);
