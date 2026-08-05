export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  author: string
  image: string
  keywords: string[]
  contentHtml: string
  featuredProductIds?: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'nghe-thuat-thiet-ke-di-va-doc-chua-tung-co-cua-ao-hawaii-9shirt',
    title: 'Nghệ thuật thiết kế "Dị & Độc" chưa từng có: Tại sao áo Hawaii 9shirt khiến giới trẻ mê mẩn?',
    excerpt: 'Bắt bài tư duy sáng tạo phá vỡ mọi quy chuẩn của 9shirt: Từ thỏ Playboy dạ quang, mèo Cosmic vũ trụ đến chú chó Bulldog nhiệt đới – nơi áo đi biển biến thành tác phẩm nghệ thuật cá tính.',
    category: 'Thiết kế & Độc bản',
    readTime: '6 phút đọc',
    date: '2026-08-05',
    author: '9Shirt Creative Director',
    image: 'https://pub-157061fd1bef406882e9cab9827efcb4.r2.dev/products/rabbit-playboys-black/mt.png',
    keywords: ['áo hawaii thiết kế độc dị', 'áo sơ mi họa tiết dị', 'áo thỏ playboy độc lạ', 'áo hawaii mèo vũ trụ', 'thời trang đi biển cá tính', '9shirt độc bản'],
    featuredProductIds: ['rabbit-playboys-black', 'cosmic-catmas', 'bulldog-forest'],
    contentHtml: `
      <h2>1. Khi áo Hawaii không chỉ còn là dừa và hoa lá cành đại trà</h2>
      <p>Nhắc đến áo Hawaii đi biển, 99% mọi người sẽ nghĩ ngay đến những chiếc áo hoa dừa, rặng dừa màu xanh đỏ thông thường bầy bán tràn ngập khắp các cửa hàng lưu niệm. Nhưng tại 9shirt, chúng tôi từ chối sự nhàm chán lặp lại đó!</p>

      <p><strong>"Dị, Độc & Chất Chơi"</strong> chính là DNA cốt lõi làm nên tên tuổi của 9shirt. Chúng tôi coi mỗi chiếc áo sơ mi lụa Latin là một bờ bãi sáng tạo vô tận, nơi văn hóa Pop-culture, linh vật huyền huyễn, trào lưu vintage và phong cách Underground hội tụ.</p>

      <h2>2. Giải mã 3 ý tưởng artwork "Siêu Dị" làm mưa làm gió tại 9shirt</h2>

      <h3>Artwork 1: Thỏ Đen Playboy – Quyến rũ, bí ẩn và chất chơi</h3>
      <p>Sự kết hợp giữa biểu tượng Thỏ Playboy kinh điển với tone màu hoa lá nhiệt đới tương phản tối (Black Neon) tạo nên một outfit vừa ngầu, vừa gợi cảm. Đây là thiết kế dành riêng cho những anh chàng thích sự lôi cuốn thầm lặng nhưng cực kỳ nổi bật khi lên đèn ban đêm hay dạo biển buổi chiều tà.</p>

      <h3>Artwork 2: Mèo Cosmic – Vũ trụ ngân hà và linh vật siêu thực</h3>
      <p>Đưa chú mèo phi hành gia du hành giữa các chòm sao ngân hà viễn tưởng 3D. Đây là mẫu thiết kế phá vỡ hoàn toàn định kiến về áo sơ mi đi biển truyền thống, mang tinh thần phiêu lưu kỳ ảo và thu hút mọi ánh nhìn tò mò của người xung quanh.</p>

      <h3>Artwork 3: Bulldog Forest & Vintage Art – Linh vật nhiệt đới và phong cách retro</h3>
      <p>Họa tiết chú chó Bulldog cá tính kết hợp rừng rậm sinh thái rực rỡ mang đến năng lượng mạnh mẽ. Mỗi đường nét artwork đều được phác thảo độc bản, giúp bạn trở thành tâm điểm của mỗi bức ảnh check-in.</p>

      <h2>3. Kỹ thuật in chuyển nhiệt 3D – "Phép thuật" hiện thực hóa những thiết kế khó nhất</h2>
      <p>Một thiết kế "dị và độc" nếu chỉ nằm trên bản vẽ máy tính sẽ không bao giờ phát huy hết vẻ đẹp nếu thiếu công nghệ in xứng tầm. Với <strong>kỹ thuật in chuyển nhiệt thăng hoa 3D</strong> chìm trực tiếp vào từng thớ sợi lụa Latin:</p>

      <ul>
        <li>Các mảng màu neon dạ quang hay hoa văn dải ngân hà thể hiện chiều sâu đa tầng 3D sống động.</li>
        <li>Bề mặt vải lụa phẳng mượt 100%, không bị tình trạng nứt gãy họa tiết phức tạp sau khi giặt máy.</li>
        <li>Từng chi tiết nhỏ nhất như sợi lông linh vật hay ánh sáng dạ quang đều nét căng ở độ phân giải 4K.</li>
      </ul>

      <h2>4. Tuyên ngôn phong cách: "Thà mặc dị để nổi bật, còn hơn chìm nghỉm giữa đám đông"</h2>
      <p>Một chiếc áo đi biển đẹp không chỉ giúp bạn chụp ảnh check-in ảo diệu, mà còn nói lên cá tính không đụng hàng của chủ nhân. Hãy để 9shirt đồng hành cùng bạn trong những chuyến đi bứt phá giới hạn và tự tin khẳng định gu thời trang riêng biệt!</p>
    `,
  },
  {
    slug: 'chat-lua-latin-la-gi-ao-hawaii-9shirt',
    title: 'Chất lụa Latin là gì? Lý do áo Hawaii 9shirt luôn mát mịn, rũ phom và bền màu mùa hè',
    excerpt: 'Tìm hiểu đặc tính vượt trội của vải lụa Latin - chất liệu cao cấp tạo nên phom dáng mềm rũ, chống nhăn và độ mát nhẹ hoàn hảo cho outfit đi biển mùa hè.',
    category: 'Chất liệu & Công nghệ',
    readTime: '5 phút đọc',
    date: '2026-08-01',
    author: '9Shirt Studio',
    image: 'https://pub-157061fd1bef406882e9cab9827efcb4.r2.dev/products/rabbit-playboys-black/mt.png',
    keywords: ['chất lụa latin là gì', 'vải lụa latin', 'lụa latin có nóng không', 'áo hawaii lụa latin', 'áo đi biển lụa latin', 'áo sơ mi lụa latin'],
    featuredProductIds: ['rabbit-playboys-black', 'cosmic-catmas'],
    contentHtml: `
      <h2>1. Chất lụa Latin là gì?</h2>
      <p>Trong thế giới thời trang du lịch và outfit hè nhiệt đới, <strong>lụa Latin</strong> (hay còn được biết đến với tên gọi lụa Pháp) được đánh giá là dòng chất liệu cao cấp hàng đầu dành cho áo Hawaii rực rỡ họa tiết. Vải được dệt với mật độ sợi mịn mật độ cao, bề mặt vải bóng mượt nhẹ nhàng, có độ co giãn nhẹ và độ rũ phom tự nhiên cực kỳ sang trọng.</p>

      <p>Khác với các loại vải cotton chéo thô ráp hoặc vải polyester mật độ thấp dễ gây cảm giác bí bách, lụa Latin mang đến trải nghiệm chạm êm ái trên da ngay từ lần mặc đầu tiên.</p>

      <h2>2. Vì sao áo Hawaii 9shirt ưu tiên lựa chọn lụa Latin?</h2>
      <p>Để tạo nên một chiếc áo sơ mi đi biển chuẩn phong cách D2C cao cấp, 9shirt đã nghiên cứu thử nghiệm trên 10 dòng vải khác nhau trước khi chốt phom lụa Latin độc quyền. Dưới đây là 4 lý do khiến chất liệu này trở thành đối tác hoàn hảo cho mùa hè:</p>

      <ul>
        <li><strong>Mềm mịn và mát nhẹ:</strong> Cấu trúc dệt sợi siêu vi giúp vải lụa Latin thông thoáng khí, tản nhiệt nhanh dưới cái nắng gay gắt đi biển hay đi dạo phố mùa hè.</li>
        <li><strong>Chống nhăn tuyệt vời:</strong> Khi xếp áo trong vali du lịch hay di chuyển đường dài, áo lụa Latin giữ độ phẳng tự nhiên mà không tốn công là lượt phức tạp.</li>
        <li><strong>Bám mực in chuyển nhiệt 3D sắc nét:</strong> Sợi lụa Latin ăn mực in nhiệt ở nhiệt độ cao cực kỳ chuẩn tông màu, giúp họa tiết tràn viền (Full-print 3D) lên màu rực rỡ và giữ độ trong nét sắc mịn.</li>
        <li><strong>Độ rũ phom sang trọng:</strong> Tự động ôm nhẹ theo chuyển động cơ thể, giúp tôn vóc dáng nam giới vừa vặn, không bị đơ đứng phom.</li>
      </ul>

      <h2>3. So sánh lụa Latin và các chất liệu vải sơ mi phổ biến</h2>
      <p>Bảng so sánh trực quan giúp bạn hiểu vì sao áo Hawaii lụa Latin 9shirt có giá trị trải nghiệm vượt trội hơn các dòng áo hàng chợ giá rẻ:</p>

      <table border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <thead>
          <tr style="background: #0f1c39; text-align: left;">
            <th>Tiêu chí</th>
            <th>Lụa Latin (9shirt)</th>
            <th>Kate / Cotton Thô</th>
            <th>Poly Thường (Hàng Chợ)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Độ mềm mại</strong></td>
            <td>Mềm rũ, mướt da</td>
            <td>Thô cứng, dễ nhăn</td>
            <td>Bóng sột soạt, thô</td>
          </tr>
          <tr>
            <td><strong>Độ thoáng mát</strong></td>
            <td>Thoát nhiệt tốt, mát mẻ</td>
            <td>Hút mồ hôi nhưng lâu khô</td>
            <td>Bí bách, nóng bức</td>
          </tr>
          <tr>
            <td><strong>Màu sắc in 3D</strong></td>
            <td>Sắc nét, lên màu tươi 100%</td>
            <td>Màu in chìm mờ</td>
            <td>Dễ nhòe, màu nhạt</td>
          </tr>
          <tr>
            <td><strong>Độ chống nhăn</strong></td>
            <td>Gần như không nhăn</td>
            <td>Cực kỳ dễ nhăn sau khi giặt</td>
            <td>Ít nhăn nhưng bí</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Hướng dẫn bảo quản áo Hawaii lụa Latin luôn như mới</h2>
      <p>Dù lụa Latin có độ bền cao, bạn vẫn nên áp dụng vài mẹo nhỏ sau để áo giữ màu và phom dáng bền lâu hơn 3 năm sử dụng:</p>
      <ol>
        <li>Nên giặt máy ở chế độ giặt nhẹ hoặc giặt tay nhanh.</li>
        <li>Hạn chế dùng dung dịch tẩy rửa quá mạnh.</li>
        <li>Phơi áo ở nơi thoáng mát, tránh ánh nắng gay gắt trực tiếp giữa trưa.</li>
        <li>Khi là/ủi (nếu cần), chọn mức nhiệt độ nhẹ dành cho chất liệu lụa/silk.</li>
      </ol>
    `,
  },
  {
    slug: 'cong-nghe-in-chuyen-nhiet-3d-ao-hawaii',
    title: 'Công nghệ in chuyển nhiệt 3D sắc nét: Tại sao họa tiết áo 9shirt giặt 100 lần không phai?',
    excerpt: 'Khám phá kỹ thuật in mực chìm 3D cao cấp trên vải lụa Latin. Họa tiết thỏ Playboy hay linh vật luôn rực rỡ, chi tiết và sắc nét từ cái nhìn đầu tiên.',
    category: 'Chất liệu & Công nghệ',
    readTime: '4 phút đọc',
    date: '2026-08-02',
    author: '9Shirt Tech Team',
    image: 'https://pub-157061fd1bef406882e9cab9827efcb4.r2.dev/products/rabbit-playboys-black/ms.png',
    keywords: ['in chuyển nhiệt 3D', 'công nghệ in 3D áo hawaii', 'in áo hawaii sắc nét', 'in áo sơ mi họa tiết', 'áo hawaii bền màu'],
    featuredProductIds: ['rabbit-playboys-black', 'cosmic-catmas'],
    contentHtml: `
      <h2>1. Khái niệm công nghệ in chuyển nhiệt 3D là gì?</h2>
      <p><strong>In chuyển nhiệt 3D (Sublimation Printing)</strong> là kỹ thuật in hiện đại sử dụng nhiệt độ và áp suất cực cao để chuyển mực in từ giấy chuyển nhiệt chuyên dụng thăng hoa trực tiếp vào sâu bên trong từng thớ sợi vải. Khác hoàn toàn với kỹ thuật in lụa thủ công hay in dán cao su ép lụa truyền thống (dễ bong nứt sau vài lần giặt), mực in 3D trở thành một phần hòa quyện vĩnh viễn với chất liệu lụa Latin.</p>

      <h2>2. Tại sao họa tiết áo 9shirt rực rỡ và bền bỉ vượt trội?</h2>
      <p>Khi ứng dụng công nghệ in chuyển nhiệt 3D trên nền vải lụa Latin cao cấp, áo Hawaii 9shirt đạt được những ưu điểm đột phá:</p>

      <ul>
        <li><strong>In chi tiết sống động (Full High-Definition):</strong> Các đường nét artwork phức tạp như thỏ Playboy hay linh vật vũ trụ nhiều lớp đều tái hiện sắc nét từng điểm ảnh.</li>
        <li><strong>Không bao giờ bong tróc hay nứt nẻ:</strong> Do mực in thăng hoa thẩm thấu vào lòng sợi lụa thay vì nằm đè lên bề mặt như in dán decal, bề mặt áo hoàn toàn mượt phẳng.</li>
        <li><strong>Không gây cứng áo hay cản trở thoáng khí:</strong> Vùng in họa tiết rộng tràn thân (Full-print) vẫn giữ nguyên độ mềm rũ và lỗ thoáng không khí tự nhiên của vải.</li>
        <li><strong>Bền màu qua 100+ lần giặt máy:</strong> Bạn có thể thoải mái giặt máy hay giặt dạo biển mà không lo nhạt màu hay lem mực sang các trang phục khác.</li>
      </ul>

      <h2>3. Quy trình 4 bước sản xuất áo Hawaii in 3D chuẩn 9shirt</h2>
      <p>Mỗi chiếc áo Hawaii tại 9shirt đều trải qua quy trình sản xuất khép kín được kiểm soát nghiêm ngặt:</p>

      <ol>
        <li><strong>Thiết kế Vector 3D độc quyền:</strong> Đội ngũ thiết kế sáng sáng tạo artwork với độ phân giải siêu nét dành riêng cho từng dòng phong cách (Animal, Art & Music, Vintage).</li>
        <li><strong>In mẫu mực thăng hoa:</strong> Mực in cao cấp nhập khẩu được dàn đều trên giấy chuyển nhiệt chuyên dụng.</li>
        <li><strong>Ép nhiệt 3D ở 200°C:</strong> Máy ép nhiệt cao áp biến mực dạng rắn thành dạng khí thăng hoa chìm vào sợi lụa Latin.</li>
        <li><strong>Cắt may thủ công ráp họa tiết:</strong> Thợ may lành nghề cắt và ráp rãnh đường chỉ chuẩn phom áo sơ mi cổ Cuban.</li>
      </ol>
    `,
  },
  {
    slug: 'ao-cuban-collar-bieu-tuong-thoi-trang-di-bien',
    title: 'Áo sơ mi cổ Cuban (Camp Collar) – Biểu tượng thời trang phóng khoáng cho outfit du lịch hè',
    excerpt: 'Lịch sử và bí quyết phối đồ với áo sơ mi cổ Cuban bẻ rũ phóng khoáng. Mix & match chuẩn gu cùng quần short đi biển và sandal năng động.',
    category: 'Phong cách & Phối đồ',
    readTime: '6 phút đọc',
    date: '2026-08-03',
    author: '9Shirt Stylist',
    image: 'https://pub-157061fd1bef406882e9cab9827efcb4.r2.dev/products/rabbit-playboys-black/mt.png',
    keywords: ['áo sơ mi cổ cuban', 'áo cổ cuban là gì', 'camp collar shirt', 'phối đồ áo đi biển nam', 'áo hawaii cổ bẻ'],
    featuredProductIds: ['rabbit-playboys-black', 'bulldog-forest'],
    contentHtml: `
      <h2>1. Nguồn gốc của kiểu áo sơ mi cổ Cuban (Cuban Collar Shirt)</h2>
      <p><strong>Áo sơ mi cổ Cuban</strong> (hay còn gọi là Camp Collar Shirt, cổ bẻ mềm không chân cổ) ra đời từ vùng biển Caribe vào giữa thế kỷ 20. Khác với thiết kế sơ mi công sở đứng dáng với chân cổ cứng gài cúc sát cổ họng, áo cổ Cuban sở hữu nẹp cổ xẻ hình chữ V tự nhiên, mở rộng nhẹ nhàng quanh bờ vai và lồng ngực.</p>

      <p>Kiểu thiết kế này mang đến tinh thần tự do, lãng tử và nét quyến rũ không cần gắng sức (effortless cool) cho phái nam trong các chuyến nghỉ dưỡng hay những ngày hè rực rỡ.</p>

      <h2>2. 3 Cách phối đồ với áo cổ Cuban Hawaii 9shirt chuẩn mốt 2026</h2>

      <h3>Mẹo 1: Phối Outfit Đi Biển Nguyên Bộ (Hawaiian Shirt + Shorts Matchy Set)</h3>
      <p>Kết hợp áo sơ mi Hawaii cổ Cuban lụa Latin cùng chiếc quần short biển đồng bộ họa tiết (Combo bộ +200k). Đây là combo thần thánh giúp bạn nổi bật lập tức giữa bãi biển hay tiệc pool party nhiệt đới.</p>

      <h3>Mẹo 2: Phối Phong Cách Casual Dạo Phố Mùa Hè (Cuban Shirt + Quần Kaki Trắng / Shorts Chino)</h3>
      <p>Phối áo sơ mi Hawaii họa tiết rực rỡ với chiếc quần short chino trơn màu (trắng, kem, be) và đi cùng đôi sandal da hay giày loafer nhẹ. Vừa thanh lịch dạo phố cafe cuối tuần, vừa giữ nét mát mẻ trẻ trung.</p>

      <h3>Mẹo 3: Phối Layer Phóng Khoáng (Khoác Ngoài Áo Thun Ba Lỗ White Tanktop)</h3>
      <p>Mở toàn bộ dải cúc áo sơ mi cổ Cuban và mặc khoác ngoài chiếc áo may-ô/tanktop trắng ôm nhẹ bên trong. Phong cách layer này tạo cảm giác vai rộng cá tính, năng động và chuẩn vibe nam tính mùa du lịch.</p>
    `,
  },
  {
    slug: 'huong-dan-chon-size-ao-hawaii-chuan-phom-nguoi-viet',
    title: 'Bí quyết chọn size áo Hawaii 9shirt chuẩn phom dáng người Việt: Nên mặc vừa hay mặc suông oversize?',
    excerpt: 'Mẹo chọn size áo đi biển vừa vặn từ S đến 5XL dựa theo chiều cao và cân nặng. Bảng quy đổi chi tiết giúp bạn chọn phom tôn dáng nhất.',
    category: 'Cẩm nang chọn size',
    readTime: '3 phút đọc',
    date: '2026-08-04',
    author: '9Shirt Fit Specialist',
    image: 'https://cdn.9tech.cloud/3D%20Hiwaii/Stock/Hiwaii_size_chart.png',
    keywords: ['bảng size áo hawaii', 'chọn size áo đi biển', 'size áo 9shirt', 'phom áo hawaii nam', 'size áo sơ mi đi biển'],
    featuredProductIds: ['rabbit-playboys-black', 'cosmic-catmas'],
    contentHtml: `
      <h2>1. Bảng quy đổi Size áo Hawaii 9shirt theo Thể trạng Nam Việt Nam</h2>
      <p>Áo sơ mi Hawaii 9shirt được thiết kế chuẩn phom dáng người Việt Nam với biên độ thoải mái ở vùng vai và vòng ngực. Dưới đây là bảng gợi ý size theo chiều cao và cân nặng chuẩn:</p>

      <table border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <thead>
          <tr style="background: #0f1c39; text-align: left;">
            <th>Size Áo</th>
            <th>Chiều Cao (cm)</th>
            <th>Cân Nặng (kg)</th>
            <th>Gợi Ý Phong Cách Mặc</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>S</strong></td>
            <td>1m55 - 1m65</td>
            <td>45 - 55 kg</td>
            <td>Vừa vặn suông nhẹ</td>
          </tr>
          <tr>
            <td><strong>M</strong></td>
            <td>1m65 - 1m72</td>
            <td>56 - 65 kg</td>
            <td>Phom suông chuẩn Hawaii</td>
          </tr>
          <tr>
            <td><strong>L</strong></td>
            <td>1m70 - 1m77</td>
            <td>66 - 75 kg</td>
            <td>Thoải mái dạo biển (Size Hot)</td>
          </tr>
          <tr>
            <td><strong>XL</strong></td>
            <td>1m75 - 1m82</td>
            <td>76 - 83 kg</td>
            <td>Rộng rãi phóng khoáng</td>
          </tr>
          <tr>
            <td><strong>2XL - 3XL</strong></td>
            <td>1m78 - 1m85</td>
            <td>84 - 95 kg</td>
            <td>Phom Bigsize vừa phom</td>
          </tr>
          <tr>
            <td><strong>4XL - 5XL</strong></td>
            <td>1m80 - 1m90</td>
            <td>96 - 110 kg</td>
            <td>Oversized rộng thoải mái</td>
          </tr>
        </tbody>
      </table>

      <h2>2. Nên mặc vừa hay chọn tăng 1 size để mặc Loose Fit?</h2>
      <p>Áo sơ mi đi biển phong cách Hawaii có tinh thần tự do phóng khoáng. Nếu bạn thích mặc gọn gàng lịch sự dạo phố cafe, hãy chọn đúng size theo bảng trên. Nếu bạn đi du lịch biển, đi resort và muốn hiệu ứng rũ rộng thoải mái giấu bụng, hãy chọn <strong>tăng thêm 1 size</strong> để đạt phom Loose Hawaii đẹp mắt nhất!</p>
    `,
  },
  {
    slug: 'top-5-mau-ao-hawaii-noi-bat-nhat-mua-du-lich-2026',
    title: 'Top 5 mẫu áo Hawaii in 3D nổi bật và bán chạy nhất mùa du lịch hè 2026',
    excerpt: 'Điểm danh 5 thiết kế áo Hawaii 9shirt cá tính nhất: Từ Thỏ Đen Playboy cao cấp đến Mèo Cosmic vũ trụ dành cho outfit du lịch và dạo phố.',
    category: 'Xu hướng thời trang',
    readTime: '5 phút đọc',
    date: '2026-08-05',
    author: '9Shirt Editor',
    image: 'https://pub-157061fd1bef406882e9cab9827efcb4.r2.dev/products/rabbit-playboys-black/mt.png',
    keywords: ['top áo hawaii đẹp', 'áo đi biển nam 2026', 'áo thỏ đen playboy', 'áo sơ mi hawaii mèo cosmic', 'áo đi biển nổi bật'],
    featuredProductIds: ['rabbit-playboys-black', 'cosmic-catmas', 'bulldog-forest'],
    contentHtml: `
      <h2>1. Áo Hawaii Thỏ Đen Playboy (Black Bunny Resort Shirt)</h2>
      <p>Đứng vị trí Best-Seller liên tục trong các mùa du lịch, mẫu <strong>Thỏ Đen Playboy</strong> sở hữu tông màu đen sâu kết hợp artwork bunny hoa lá dạ quang cực sắc nét. Phối nền tối giúp tôn da và dễ dàng phối cùng mọi trang phục.</p>

      <h2>2. Áo Hawaii Mèo Cosmic (Cosmic Catmas Resort Shirt)</h2>
      <p>Họa tiết mèo Cosmic không gian đầy bí ẩn và độc lạ dành cho các anh chàng yêu động vật và thích gu đồ graphic mới mẻ không đụng hàng.</p>

      <h2>3. Áo Hawaii Bulldog Forest (Bulldog Jungle Shirt)</h2>
      <p>Họa tiết chú chó Bulldog ngầu đét kết hợp rừng rậm nhiệt đới rực rỡ, mang đến năng lượng mạo hiểm tươi mới cho mỗi bức ảnh du lịch check-in của bạn.</p>
    `,
  },
]

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.slug !== currentSlug).slice(0, limit)
}
