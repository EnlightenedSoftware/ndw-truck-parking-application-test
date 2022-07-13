package org.ndw.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.ndw.myapp.IntegrationTest;
import org.ndw.myapp.domain.ParkingEntrance;
import org.ndw.myapp.repository.ParkingEntranceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ParkingEntranceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ParkingEntranceResourceIT {

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final String DEFAULT_PRIMARY_ROAD_ID = "AAAAAAAAAA";
    private static final String UPDATED_PRIMARY_ROAD_ID = "BBBBBBBBBB";

    private static final String DEFAULT_ALTERNATIVE_ROAD_ID = "AAAAAAAAAA";
    private static final String UPDATED_ALTERNATIVE_ROAD_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/parking-entrances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ParkingEntranceRepository parkingEntranceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restParkingEntranceMockMvc;

    private ParkingEntrance parkingEntrance;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParkingEntrance createEntity(EntityManager em) {
        ParkingEntrance parkingEntrance = new ParkingEntrance()
            .location(DEFAULT_LOCATION)
            .primaryRoadId(DEFAULT_PRIMARY_ROAD_ID)
            .alternativeRoadId(DEFAULT_ALTERNATIVE_ROAD_ID);
        return parkingEntrance;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ParkingEntrance createUpdatedEntity(EntityManager em) {
        ParkingEntrance parkingEntrance = new ParkingEntrance()
            .location(UPDATED_LOCATION)
            .primaryRoadId(UPDATED_PRIMARY_ROAD_ID)
            .alternativeRoadId(UPDATED_ALTERNATIVE_ROAD_ID);
        return parkingEntrance;
    }

    @BeforeEach
    public void initTest() {
        parkingEntrance = createEntity(em);
    }

    @Test
    @Transactional
    void createParkingEntrance() throws Exception {
        int databaseSizeBeforeCreate = parkingEntranceRepository.findAll().size();
        // Create the ParkingEntrance
        restParkingEntranceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parkingEntrance))
            )
            .andExpect(status().isCreated());

        // Validate the ParkingEntrance in the database
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeCreate + 1);
        ParkingEntrance testParkingEntrance = parkingEntranceList.get(parkingEntranceList.size() - 1);
        assertThat(testParkingEntrance.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testParkingEntrance.getPrimaryRoadId()).isEqualTo(DEFAULT_PRIMARY_ROAD_ID);
        assertThat(testParkingEntrance.getAlternativeRoadId()).isEqualTo(DEFAULT_ALTERNATIVE_ROAD_ID);
    }

    @Test
    @Transactional
    void createParkingEntranceWithExistingId() throws Exception {
        // Create the ParkingEntrance with an existing ID
        parkingEntrance.setId(1L);

        int databaseSizeBeforeCreate = parkingEntranceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restParkingEntranceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parkingEntrance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParkingEntrance in the database
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllParkingEntrances() throws Exception {
        // Initialize the database
        parkingEntranceRepository.saveAndFlush(parkingEntrance);

        // Get all the parkingEntranceList
        restParkingEntranceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(parkingEntrance.getId().intValue())))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].primaryRoadId").value(hasItem(DEFAULT_PRIMARY_ROAD_ID)))
            .andExpect(jsonPath("$.[*].alternativeRoadId").value(hasItem(DEFAULT_ALTERNATIVE_ROAD_ID)));
    }

    @Test
    @Transactional
    void getParkingEntrance() throws Exception {
        // Initialize the database
        parkingEntranceRepository.saveAndFlush(parkingEntrance);

        // Get the parkingEntrance
        restParkingEntranceMockMvc
            .perform(get(ENTITY_API_URL_ID, parkingEntrance.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(parkingEntrance.getId().intValue()))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.primaryRoadId").value(DEFAULT_PRIMARY_ROAD_ID))
            .andExpect(jsonPath("$.alternativeRoadId").value(DEFAULT_ALTERNATIVE_ROAD_ID));
    }

    @Test
    @Transactional
    void getNonExistingParkingEntrance() throws Exception {
        // Get the parkingEntrance
        restParkingEntranceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewParkingEntrance() throws Exception {
        // Initialize the database
        parkingEntranceRepository.saveAndFlush(parkingEntrance);

        int databaseSizeBeforeUpdate = parkingEntranceRepository.findAll().size();

        // Update the parkingEntrance
        ParkingEntrance updatedParkingEntrance = parkingEntranceRepository.findById(parkingEntrance.getId()).get();
        // Disconnect from session so that the updates on updatedParkingEntrance are not directly saved in db
        em.detach(updatedParkingEntrance);
        updatedParkingEntrance
            .location(UPDATED_LOCATION)
            .primaryRoadId(UPDATED_PRIMARY_ROAD_ID)
            .alternativeRoadId(UPDATED_ALTERNATIVE_ROAD_ID);

        restParkingEntranceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedParkingEntrance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedParkingEntrance))
            )
            .andExpect(status().isOk());

        // Validate the ParkingEntrance in the database
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeUpdate);
        ParkingEntrance testParkingEntrance = parkingEntranceList.get(parkingEntranceList.size() - 1);
        assertThat(testParkingEntrance.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testParkingEntrance.getPrimaryRoadId()).isEqualTo(UPDATED_PRIMARY_ROAD_ID);
        assertThat(testParkingEntrance.getAlternativeRoadId()).isEqualTo(UPDATED_ALTERNATIVE_ROAD_ID);
    }

    @Test
    @Transactional
    void putNonExistingParkingEntrance() throws Exception {
        int databaseSizeBeforeUpdate = parkingEntranceRepository.findAll().size();
        parkingEntrance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParkingEntranceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, parkingEntrance.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parkingEntrance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParkingEntrance in the database
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchParkingEntrance() throws Exception {
        int databaseSizeBeforeUpdate = parkingEntranceRepository.findAll().size();
        parkingEntrance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParkingEntranceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parkingEntrance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParkingEntrance in the database
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamParkingEntrance() throws Exception {
        int databaseSizeBeforeUpdate = parkingEntranceRepository.findAll().size();
        parkingEntrance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParkingEntranceMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parkingEntrance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParkingEntrance in the database
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateParkingEntranceWithPatch() throws Exception {
        // Initialize the database
        parkingEntranceRepository.saveAndFlush(parkingEntrance);

        int databaseSizeBeforeUpdate = parkingEntranceRepository.findAll().size();

        // Update the parkingEntrance using partial update
        ParkingEntrance partialUpdatedParkingEntrance = new ParkingEntrance();
        partialUpdatedParkingEntrance.setId(parkingEntrance.getId());

        partialUpdatedParkingEntrance.location(UPDATED_LOCATION);

        restParkingEntranceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParkingEntrance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParkingEntrance))
            )
            .andExpect(status().isOk());

        // Validate the ParkingEntrance in the database
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeUpdate);
        ParkingEntrance testParkingEntrance = parkingEntranceList.get(parkingEntranceList.size() - 1);
        assertThat(testParkingEntrance.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testParkingEntrance.getPrimaryRoadId()).isEqualTo(DEFAULT_PRIMARY_ROAD_ID);
        assertThat(testParkingEntrance.getAlternativeRoadId()).isEqualTo(DEFAULT_ALTERNATIVE_ROAD_ID);
    }

    @Test
    @Transactional
    void fullUpdateParkingEntranceWithPatch() throws Exception {
        // Initialize the database
        parkingEntranceRepository.saveAndFlush(parkingEntrance);

        int databaseSizeBeforeUpdate = parkingEntranceRepository.findAll().size();

        // Update the parkingEntrance using partial update
        ParkingEntrance partialUpdatedParkingEntrance = new ParkingEntrance();
        partialUpdatedParkingEntrance.setId(parkingEntrance.getId());

        partialUpdatedParkingEntrance
            .location(UPDATED_LOCATION)
            .primaryRoadId(UPDATED_PRIMARY_ROAD_ID)
            .alternativeRoadId(UPDATED_ALTERNATIVE_ROAD_ID);

        restParkingEntranceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParkingEntrance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParkingEntrance))
            )
            .andExpect(status().isOk());

        // Validate the ParkingEntrance in the database
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeUpdate);
        ParkingEntrance testParkingEntrance = parkingEntranceList.get(parkingEntranceList.size() - 1);
        assertThat(testParkingEntrance.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testParkingEntrance.getPrimaryRoadId()).isEqualTo(UPDATED_PRIMARY_ROAD_ID);
        assertThat(testParkingEntrance.getAlternativeRoadId()).isEqualTo(UPDATED_ALTERNATIVE_ROAD_ID);
    }

    @Test
    @Transactional
    void patchNonExistingParkingEntrance() throws Exception {
        int databaseSizeBeforeUpdate = parkingEntranceRepository.findAll().size();
        parkingEntrance.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParkingEntranceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, parkingEntrance.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parkingEntrance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParkingEntrance in the database
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchParkingEntrance() throws Exception {
        int databaseSizeBeforeUpdate = parkingEntranceRepository.findAll().size();
        parkingEntrance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParkingEntranceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parkingEntrance))
            )
            .andExpect(status().isBadRequest());

        // Validate the ParkingEntrance in the database
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamParkingEntrance() throws Exception {
        int databaseSizeBeforeUpdate = parkingEntranceRepository.findAll().size();
        parkingEntrance.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParkingEntranceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parkingEntrance))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ParkingEntrance in the database
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteParkingEntrance() throws Exception {
        // Initialize the database
        parkingEntranceRepository.saveAndFlush(parkingEntrance);

        int databaseSizeBeforeDelete = parkingEntranceRepository.findAll().size();

        // Delete the parkingEntrance
        restParkingEntranceMockMvc
            .perform(delete(ENTITY_API_URL_ID, parkingEntrance.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ParkingEntrance> parkingEntranceList = parkingEntranceRepository.findAll();
        assertThat(parkingEntranceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
