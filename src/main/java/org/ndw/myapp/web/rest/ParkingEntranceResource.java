package org.ndw.myapp.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.ndw.myapp.domain.ParkingEntrance;
import org.ndw.myapp.repository.ParkingEntranceRepository;
import org.ndw.myapp.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.ndw.myapp.domain.ParkingEntrance}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ParkingEntranceResource {

    private final Logger log = LoggerFactory.getLogger(ParkingEntranceResource.class);

    private static final String ENTITY_NAME = "parkingEntrance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParkingEntranceRepository parkingEntranceRepository;

    public ParkingEntranceResource(ParkingEntranceRepository parkingEntranceRepository) {
        this.parkingEntranceRepository = parkingEntranceRepository;
    }

    /**
     * {@code POST  /parking-entrances} : Create a new parkingEntrance.
     *
     * @param parkingEntrance the parkingEntrance to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parkingEntrance, or with status {@code 400 (Bad Request)} if the parkingEntrance has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parking-entrances")
    public ResponseEntity<ParkingEntrance> createParkingEntrance(@RequestBody ParkingEntrance parkingEntrance) throws URISyntaxException {
        log.debug("REST request to save ParkingEntrance : {}", parkingEntrance);
        if (parkingEntrance.getId() != null) {
            throw new BadRequestAlertException("A new parkingEntrance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ParkingEntrance result = parkingEntranceRepository.save(parkingEntrance);
        return ResponseEntity
            .created(new URI("/api/parking-entrances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /parking-entrances/:id} : Updates an existing parkingEntrance.
     *
     * @param id the id of the parkingEntrance to save.
     * @param parkingEntrance the parkingEntrance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parkingEntrance,
     * or with status {@code 400 (Bad Request)} if the parkingEntrance is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parkingEntrance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parking-entrances/{id}")
    public ResponseEntity<ParkingEntrance> updateParkingEntrance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ParkingEntrance parkingEntrance
    ) throws URISyntaxException {
        log.debug("REST request to update ParkingEntrance : {}, {}", id, parkingEntrance);
        if (parkingEntrance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parkingEntrance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parkingEntranceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ParkingEntrance result = parkingEntranceRepository.save(parkingEntrance);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parkingEntrance.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /parking-entrances/:id} : Partial updates given fields of an existing parkingEntrance, field will ignore if it is null
     *
     * @param id the id of the parkingEntrance to save.
     * @param parkingEntrance the parkingEntrance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parkingEntrance,
     * or with status {@code 400 (Bad Request)} if the parkingEntrance is not valid,
     * or with status {@code 404 (Not Found)} if the parkingEntrance is not found,
     * or with status {@code 500 (Internal Server Error)} if the parkingEntrance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parking-entrances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ParkingEntrance> partialUpdateParkingEntrance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ParkingEntrance parkingEntrance
    ) throws URISyntaxException {
        log.debug("REST request to partial update ParkingEntrance partially : {}, {}", id, parkingEntrance);
        if (parkingEntrance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parkingEntrance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parkingEntranceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ParkingEntrance> result = parkingEntranceRepository
            .findById(parkingEntrance.getId())
            .map(existingParkingEntrance -> {
                if (parkingEntrance.getLocation() != null) {
                    existingParkingEntrance.setLocation(parkingEntrance.getLocation());
                }
                if (parkingEntrance.getPrimaryRoadId() != null) {
                    existingParkingEntrance.setPrimaryRoadId(parkingEntrance.getPrimaryRoadId());
                }
                if (parkingEntrance.getAlternativeRoadId() != null) {
                    existingParkingEntrance.setAlternativeRoadId(parkingEntrance.getAlternativeRoadId());
                }

                return existingParkingEntrance;
            })
            .map(parkingEntranceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parkingEntrance.getId().toString())
        );
    }

    /**
     * {@code GET  /parking-entrances} : get all the parkingEntrances.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parkingEntrances in body.
     */
    @GetMapping("/parking-entrances")
    public List<ParkingEntrance> getAllParkingEntrances() {
        log.debug("REST request to get all ParkingEntrances");
        return parkingEntranceRepository.findAll();
    }

    /**
     * {@code GET  /parking-entrances/:id} : get the "id" parkingEntrance.
     *
     * @param id the id of the parkingEntrance to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parkingEntrance, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parking-entrances/{id}")
    public ResponseEntity<ParkingEntrance> getParkingEntrance(@PathVariable Long id) {
        log.debug("REST request to get ParkingEntrance : {}", id);
        Optional<ParkingEntrance> parkingEntrance = parkingEntranceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parkingEntrance);
    }

    /**
     * {@code DELETE  /parking-entrances/:id} : delete the "id" parkingEntrance.
     *
     * @param id the id of the parkingEntrance to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parking-entrances/{id}")
    public ResponseEntity<Void> deleteParkingEntrance(@PathVariable Long id) {
        log.debug("REST request to delete ParkingEntrance : {}", id);
        parkingEntranceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
