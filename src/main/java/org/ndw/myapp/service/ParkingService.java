package org.ndw.myapp.service;

import java.util.Optional;
import org.ndw.myapp.domain.Parking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Parking}.
 */
public interface ParkingService {
    /**
     * Save a parking.
     *
     * @param parking the entity to save.
     * @return the persisted entity.
     */
    Parking save(Parking parking);

    /**
     * Updates a parking.
     *
     * @param parking the entity to update.
     * @return the persisted entity.
     */
    Parking update(Parking parking);

    /**
     * Partially updates a parking.
     *
     * @param parking the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Parking> partialUpdate(Parking parking);

    /**
     * Get all the parkings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Parking> findAll(Pageable pageable);

    /**
     * Get the "id" parking.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Parking> findOne(Long id);

    /**
     * Delete the "id" parking.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
