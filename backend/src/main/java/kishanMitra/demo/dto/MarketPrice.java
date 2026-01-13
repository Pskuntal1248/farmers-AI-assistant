package kishanMitra.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MarketPrice {
    private String serialNo;
    private String market;
    private String commodity;
    private String variety;
    private Double minPrice;
    private Double maxPrice;
    private Double modalPrice;
    private String date;
    private String state;
}
