package org.ndw.myapp.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.ndw.myapp.domain.Parking;
import org.ndw.myapp.repository.ParkingRepository;
import org.ndw.myapp.service.ParkingService;
import org.ndw.myapp.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.ndw.myapp.domain.Parking}.
 */
@RestController
@RequestMapping("/api")
public class ParkingResource {

    private final Logger log = LoggerFactory.getLogger(ParkingResource.class);

    private static final String ENTITY_NAME = "parking";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParkingService parkingService;

    private final ParkingRepository parkingRepository;

    public ParkingResource(ParkingService parkingService, ParkingRepository parkingRepository) {
        this.parkingService = parkingService;
        this.parkingRepository = parkingRepository;
    }

    /**
     * {@code POST  /parkings} : Create a new parking.
     *
     * @param parking the parking to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parking, or with status {@code 400 (Bad Request)} if the parking has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parkings")
    public ResponseEntity<Parking> createParking(@RequestBody Parking parking) throws URISyntaxException {
        log.debug("REST request to save Parking : {}", parking);
        if (parking.getId() != null) {
            throw new BadRequestAlertException("A new parking cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Parking result = parkingService.save(parking);
        return ResponseEntity
            .created(new URI("/api/parkings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /parkings/:id} : Updates an existing parking.
     *
     * @param id the id of the parking to save.
     * @param parking the parking to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parking,
     * or with status {@code 400 (Bad Request)} if the parking is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parking couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parkings/{id}")
    public ResponseEntity<Parking> updateParking(@PathVariable(value = "id", required = false) final Long id, @RequestBody Parking parking)
        throws URISyntaxException {
        log.debug("REST request to update Parking : {}, {}", id, parking);
        if (parking.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parking.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parkingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Parking result = parkingService.update(parking);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parking.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /parkings/:id} : Partial updates given fields of an existing parking, field will ignore if it is null
     *
     * @param id the id of the parking to save.
     * @param parking the parking to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parking,
     * or with status {@code 400 (Bad Request)} if the parking is not valid,
     * or with status {@code 404 (Not Found)} if the parking is not found,
     * or with status {@code 500 (Internal Server Error)} if the parking couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parkings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Parking> partialUpdateParking(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Parking parking
    ) throws URISyntaxException {
        log.debug("REST request to partial update Parking partially : {}, {}", id, parking);
        if (parking.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parking.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parkingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Parking> result = parkingService.partialUpdate(parking);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, parking.getId().toString())
        );
    }

    /**
     * {@code GET  /parkings} : get all the parkings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parkings in body.
     */
    @GetMapping("/parkings")
    public ResponseEntity<List<Parking>> getAllParkings(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Parkings");
        Page<Parking> page = parkingService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /parkings/:id} : get the "id" parking.
     *
     * @param id the id of the parking to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parking, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parkings/{id}")
    public ResponseEntity<Parking> getParking(@PathVariable Long id) {
        log.debug("REST request to get Parking : {}", id);
        Optional<Parking> parking = parkingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(parking);
    }

    /**
     * {@code DELETE  /parkings/:id} : delete the "id" parking.
     *
     * @param id the id of the parking to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parkings/{id}")
    public ResponseEntity<Void> deleteParking(@PathVariable Long id) {
        log.debug("REST request to delete Parking : {}", id);
        parkingService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
