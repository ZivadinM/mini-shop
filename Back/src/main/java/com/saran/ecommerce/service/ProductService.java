package com.saran.ecommerce.service;

import org.springframework.validation.annotation.Validated;

import com.saran.ecommerce.model.Product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Validated
public interface ProductService {
    //definisemo dodaju proizvoda u korpu//
    @NotNull Iterable<Product> getAllProducts();

    Product getProduct(@Min(value = 1L, message = "Invalid product ID.") long id);

    Product save(Product product);
}
