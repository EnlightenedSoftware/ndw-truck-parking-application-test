package org.ndw.myapp.repository;

import org.ndw.myapp.domain.Parking;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Parking entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParkingRepository extends JpaRepository<Parking, Long> {}
