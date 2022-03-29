---
sidebar_position: 1
---

# Tổng quát về Telescope

## Mở đầu

Một trong những mục tiêu chính của việc tham gia và đóng góp của Seneca cho cộng đồng open-source là nhấn mạnh vào việc chia sẻ những gì chúng tôi đang làm việc, giảng dạy và học tập thông qua việc viết blog. Chúng tôi tin rằng một trong những phần bổ ích nhất của việc học cách làm việc trong cộng đồng nguồn mở là khám phá ra rằng một người có thể trở thành một phần của thế giới web, tìm thấy tiếng nói và xây dựng một lượng người theo dõi.

Chúng tôi cũng tin rằng việc đọc các blog của nhau là rất quan trọng. Trong các bài đăng trên blog của các đồng nghiệp, chúng tôi thấy rằng chúng tôi không đơn độc trong cuộc đấu tranh để làm cho mọi thứ hoạt động, sở thích của chúng tôi trong các chủ đề khác nhau và imposter syndrome - cảm giác không có đủ khả năng và đánh giá thấp bản thân - không phải là điều mà chỉ riêng tôi phải trải qua.

Để hỗ trợ tốt hơn việc khám phá các blog trong cộng đồng của chúng tôi, chúng tôi dựng lên một trang web open source (nguồn mở) [Planet](<https://en.wikipedia.org/wiki/Planet_(software)>) để tổng hợp các bài blog từ các giảng viên và sinh viên Seneca làm việc trên nguồn mở trong một trang duy nhất. Blog Planet của chúng tôi hiện đang hoạt động tại [Planet CDOT](https://telescope.cdot.systems/planet).

## Planet là gì?

> Planet là một ứng dụng tổng hợp nguồn cấp dữ liệu được thiết kế để thu thập các bài đăng từ nhật ký web của các thành viên trong cộng đồng Internet và hiển thị chúng trên một trang duy nhất. Planet chạy trên một máy chủ web. Nó tạo ra các trang và lấy dữ liệu từ nguồn cấp dữ liệu gốc theo thứ tự thời gian, các dữ liệu được nhập gần đây nhất trước. --[Wikipedia](<https://en.wikipedia.org/wiki/Planet_(software)>)

Vào đầu những năm 2000, trước sự trỗi dậy của các ứng dụng truyền thông xã hội như Twitter và Facebook, Planet đã giải quyết được một vấn đề quan trọng trong cộng đồng tự do và open source. Nó sử dụng các công nghệ “nguồn cấp dữ liệu” khác nhau như là RSS, Atom, CDF để cho phép các bài đăng trên blog từ các nền tảng khác nhau được tổng hợp thành một trang duy nhất, và được cập nhật liên tục với các bài đăng mới nhất của những mọi người trong một cộng đồng cụ thể.

Được viết bằng Python bởi Jeff Waugh và Scott James Remnant, Planet có thể được định cấu hình với một danh sách các nguồn cấp dữ liệu blog và một mẫu HTML. Nó sẽ sử dụng những thứ này để tạo ra một trang web một cách linh hoạt với các bài đăng theo thứ tự thời gian từ các nguồn cấp dữ liệu được chỉ định.

## Đi tìm một ngôi nhà mới

Planet hiện tại của chúng ta đã không còn nữa. Phần mềm chúng tôi sử dụng được cập nhật lần cuối cách đây 13 năm. Mặc dù mã cơ bản đã trôi xa hơn vào quá khứ, nhưng nhu cầu của chúng tôi vẫn tiếp tục được duy trì. Duy trì hệ thống hiện có, đặc biệt là với số lượng sinh viên tham gia vào open source tại Seneca, đã trở nên cực kì khó khăn. Trang web hiện tại của chúng tôi thường xuyên bị hỏng và cần được làm mới thủ công thường xuyên. Trong tương lai, chúng ta cần một Planet mới được gọi là nhà.

Khi chúng tôi sẵn sàng bước vào năm 2020, chúng tôi đã quyết định rằng đã đến lúc để xem xét chuyển sang một hệ thống mới. Thật không may, hầu hết mọi hệ thống thay thế Planet đều trở nên vô nghĩa.

Thay vì cố gắng tìm một giải pháp hiện có, chúng tôi quyết định thử và tạo ra một giải pháp. Bởi vì chúng tôi cần phần mềm này, chúng tôi cũng cảm thấy rằng mình nên tạo ra và duy trì nó. Và vì nhu cầu của chúng tôi về một Planet xuất phát từ công việc chung của chúng tôi trên nguồn mở, chúng tôi nghĩ rằng việc tạo ra nó _cùng nhau dưới dạng open source_ sẽ là con đường mong muốn nhất để tiến về phía trước.

## Cố gắng xác định Planet của chúng ta

We have learned a number of things over the past decade running our own planet.
We've also watched as social media and modern technologies have reshaped our
expectations for what a system like this can and should be. This has gone into our design and implementation of our new Telescope project.

Chúng ta đã học được một số điều trong thập kỷ qua khi vận hành Planet của chính chúng ta. Chúng tôi cũng đã theo dõi khi phương tiện truyền thông xã hội và các công nghệ hiện đại đã định hình lại kỳ vọng của chúng tôi về những gì mà hệ thống này có thể và nên đạt được. Điều này đã được đưa vào thiết kế và triển khai dự án Telescope của chúng tôi.

Xem [kiến trúc](architecture.md) để có một sự hình dung đầy đủ hơn về thiết kế hiện tại của chúng tôi.

## Lịch sử của Telescope

- [Telescope 1.0](https://blog.humphd.org/telescope-1-0-0-or-dave-is-once-again-asking-for-a-blog/) (tháng 4 năm 2020)
- [Telescope 2.0](https://blog.humphd.org/telescope-2-0/) (tháng 4 năm 2021)
- [Telescope 3.0](https://blog.humphd.org/toward-telescope-3-0/) (đang tiến hành, tháng 4 2022)

### 1.0

[Telescope 1.0](https://github.com/Seneca-CDOT/telescope/releases/tag/1.0.0) đã thực hiện được nhiều mục tiêu của chúng tôi, bao gồm:

- Một lớp truy cập dữ liệu máy chủ node.js cố định cung cấp các REST APIs và GraphQL
- Cấu trúc dữ liệu hàng đợi node.js để xử lý nguồn cấp dữ liệu song song
- Hoàn thành thiết kế giao diện người dùng
- Ứng dụng web giao diện người dùng GatsbyJS sử dụng các thành phần Material UI React
- Xác thực đăng nhập một lần dựa trên SAML2
- Quản lý vùng chứa dựa trên Docker/Docker Compose
- CI/CD pipelines sử dụng CircleCI và Travis CI
- Bản xem trước Pull Request sử dụng Zeit Now
- Cơ sở dữ liệu Redis để lưu vào bộ nhớ đệm các nguồn cấp dữ liệu và bài đăng
- Cơ sử dữ liệu Elasticsearch để tìm kiếm toàn văn các bài đăng
- Một proxy ngược Nginx và máy chủ bộ đệm HTTP
- Certbot để quản lý chứng chỉ SSL với Let's Encrypt
- Dịch vụ GitHub Webhook dựa trên node.js để tự động quản lý các triển khai
- Các sự kiện push của GitHub và webhook để tự động hoá các bản staging và production, cũng như triển khai green/blue deployment
- Triển khai staging (<https://dev.telescope.cdot.systems/>) và production (<https://telescope.cdot.systems/>)

### 2.0

[Telescope 2.0](https://github.com/Seneca-CDOT/telescope/releases/tag/2.0.0) improved and extended this design:

- Cơ sở hạ tầng thử nghiệm được cải thiện, bao gồm snapshot, end-to-end, và unit test
- Đổi CI/CD thành GitHub Actions
- Cải thiện SEO
- Thêm Firebase làm kho dử liệu back-end cho thông tin người dùng
- Các cải tiến đối với xác thực dựa trên SAML, JWT Authorization, và bảo mật luồng đăng ký của người dùng
- Thiết kế giao diện người dùng, Logo, CSS, và Theme mới
- Cải thiện khả năng truy cập và trải nghiệm người dùng
- Di chuyển back-end cố định sang Microservices (hoàn thành 90%) và API Gateway bằng Traefik
- Cải tiến cho Elasticsearch và Redis
- Toàn bộ cổng giao diện người dùng từ GatsbyJS sang next.js
- Viết lại TypeScript của giao diện người dùng
- Cập nhật và bảo trì các dependency, cả thủ công và tự động (Dependabot)
- Sửa các lỗi và hoàn thành những vấn đề về kỹ thuật
- Hỗ trợ ứng dụng web (PWA) và giao diện người dùng bằng điện thoại
- Cải tiến Docker
- Các bản sửa lỗi, cập nhật và cải tiến của Automation và Tooling
- Cải tiến nginx, bộ nhớ đệm và quản lý chứng chỉ
- Cập nhật các tài liệu liên quan
- Trải nghiệm nhà phát triển được cải thiện, bao gồm các bản sửa lỗi cho sự khác biệt giữa các nền tảng

### 3.0

Đang tiến hành.
