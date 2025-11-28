package de.onlineshop.onlineshop_backend.init;

import de.onlineshop.onlineshop_backend.model.Product;
import de.onlineshop.onlineshop_backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(ProductRepository productRepository) {
        return args -> {
            // Nur initialisieren, wenn noch keine Produkte da sind
            if (productRepository.count() == 0) {
                Product p1 = new Product(
                        "Campus Hoodie",
                        "Bequemer Hoodie mit Unilogo",
                        new BigDecimal("49.90"),
                        "https://example.com/images/hoodie.png"
                );

                Product p2 = new Product(
                        "Kaffeetasse",
                        "Weiße Tasse mit CampusShop-Logo",
                        new BigDecimal("12.50"),
                        "https://example.com/images/mug.png"
                );

                Product p3 = new Product(
                        "Notizbuch",
                        "DIN A5 Notizbuch kariert",
                        new BigDecimal("7.90"),
                        "https://example.com/images/notebook.png"
                );

                productRepository.saveAll(List.of(p1, p2, p3));
                System.out.println(">>> Beispielprodukte angelegt.");
            }
        };
    }
}