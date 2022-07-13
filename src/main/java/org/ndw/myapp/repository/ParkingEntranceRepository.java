package org.ndw.myapp.repository;

import org.ndw.myapp.domain.ParkingEntrance;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ParkingEntrance entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParkingEntranceRepository extends JpaRepository<ParkingEntrance, Long> {}
