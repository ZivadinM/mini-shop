package com.saran.ecommerce.repository;

import com.saran.ecommerce.model.OrderProduct;
import com.saran.ecommerce.model.OrderProductPK;
import org.springframework.data.repository.CrudRepository;

public interface OrderProductRepository extends CrudRepository<OrderProduct, OrderProductPK> {
}
