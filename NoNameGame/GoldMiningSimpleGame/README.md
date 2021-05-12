Lưu ý: Đây là bản kế hoạch của dự án này, tui viết kiểu "thích gì viết nấy", "ép-bi-ai" (FBI ^^) đã khuyến cáo, đọc xong không hỉu thì chúng tui hông chịu trách nhịm!
- Chèn AdsFrame chính toàn game, ở mỗi cách (cày/đầu tư) sẽ có frame/phiên chạy. Có thông báo có thể sẽ bị lag
- GoldMiningSimpleGame (GMSG) này có thể được nhúng vào một game/prj (tạm gọi là "empla") khác nhưng chỉ với vai trò là "tài trợ" cho game đó (ở "empla" đó có thể chèn thêm AdsFrame nào đó)
- Số vàng (đvt: thỏi), làm tròn 2 số thập phân (cho phép âm tối đa 96 thỏi)
- Thông báo: không được đóng tab khi đang trong phiên (cày/đầu tư)

## Đào vàng (cách kiếm vàng số 1)
- Mua 1 phiên đào với 16 thỏi. Chạy trong 4 phút. Mỗi giây sẽ random đào được từ 0-0.4 thỏi
=> Tối đa 96 thỏi/lần đào
- Sau mỗi lần đào sẽ được thưởng thêm không quá 4.17% tổng số vàng => tối đa nhận được 100 (= 104.17% * 96) thỏi/lần
- Nhớ xoá AdsFrame sau khi hết phiên

## Đầu tư vàng (cách kiếm vàng số 2)
_Đây là đầu tư vào GoCoin (lưu ý, GoCoin chỉ có giá trị trong cách số 2 của GMSG)_
- Tỉ giá ở đây là tỉ giá đổi từ GoCoin sang Vàng (đvt: thỏi)
- Tỉ giá đầu phiên giao dịch: 1 - 1, được làm tròn 2 số thập phân
- Mỗi 1 giây sẽ điều chỉnh tỉ giá lên/xuống ngẫu nhiên (50-50)
- Khi người chơi chọn kết thúc phiên giao dịch:
    + Đổi từ GoCoin -> Vàng
    + Reset tỉ giá
    + Xoá AdsFrame
    + Nếu số tiền kiếm được nhỏ hơn a thì sẽ bị trừ b%. Nếu số tiền kiếm được lớn hơn a thì sẽ được cộng b% (a, b sẽ được set qua param ở URL. Set a, b là một đặc quyền cho "empla", họ có thể thay đổi a, b theo sự kiện, người chơi hoặc "hứng lên là thay" ^^)
- Nếu tỉ giá luôn giảm, đến khi về 0 thì sẽ tự động kết thúc phiên giao dịch và không nhận được gì

## Giao diện và một số cải thiện trong tương lai
- Có thể tui sẽ cải thiện giao diện cho nó đẹp hơn
- Ngoài ra, các animation liên quan đến đào vàng hay đầu tư cũng sẽ được cải thiện hơn