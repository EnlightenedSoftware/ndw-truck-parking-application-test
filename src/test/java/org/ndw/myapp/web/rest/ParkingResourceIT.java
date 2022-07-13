package org.ndw.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.ndw.myapp.IntegrationTest;
import org.ndw.myapp.domain.Parking;
import org.ndw.myapp.repository.ParkingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ParkingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ParkingResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final Long DEFAULT_PLACES = 1L;
    private static final Long UPDATED_PLACES = 2L;

    private static final Long DEFAULT_REFRIGERATED_PLACES = 1L;
    private static final Long UPDATED_REFRIGERATED_PLACES = 2L;

    private static final Long DEFAULT_LZV_PLACES = 1L;
    private static final Long UPDATED_LZV_PLACES = 2L;

    private static final Long DEFAULT_HOURLY_RATE = 1L;
    private static final Long UPDATED_HOURLY_RATE = 2L;

    private static final String DEFAULT_PRICING_URL = "AAAAAAAAAA";
    private static final String UPDATED_PRICING_URL = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_SERVICES_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_SERVICES_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_ORGANIZATION = "AAAAAAAAAA";
    private static final String UPDATED_ORGANIZATION = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_ON = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_ON = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_UPDATED_ON = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_ON = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_UPDATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATED_BY = "BBBBBBBBBB";

    private static final String DEFAULT_IS_ACTIVE = "AAAAAAAAAA";
    private static final String UPDATED_IS_ACTIVE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/parkings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ParkingRepository parkingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restParkingMockMvc;

    private Parking parking;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parking createEntity(EntityManager em) {
        Parking parking = new Parking()
            .name(DEFAULT_NAME)
            .location(DEFAULT_LOCATION)
            .places(DEFAULT_PLACES)
            .refrigeratedPlaces(DEFAULT_REFRIGERATED_PLACES)
            .lzvPlaces(DEFAULT_LZV_PLACES)
            .hourlyRate(DEFAULT_HOURLY_RATE)
            .pricingUrl(DEFAULT_PRICING_URL)
            .otherServicesDescription(DEFAULT_OTHER_SERVICES_DESCRIPTION)
            .organization(DEFAULT_ORGANIZATION)
            .createdOn(DEFAULT_CREATED_ON)
            .createdBy(DEFAULT_CREATED_BY)
            .updatedOn(DEFAULT_UPDATED_ON)
            .updatedBy(DEFAULT_UPDATED_BY)
            .isActive(DEFAULT_IS_ACTIVE);
        return parking;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parking createUpdatedEntity(EntityManager em) {
        Parking parking = new Parking()
            .name(UPDATED_NAME)
            .location(UPDATED_LOCATION)
            .places(UPDATED_PLACES)
            .refrigeratedPlaces(UPDATED_REFRIGERATED_PLACES)
            .lzvPlaces(UPDATED_LZV_PLACES)
            .hourlyRate(UPDATED_HOURLY_RATE)
            .pricingUrl(UPDATED_PRICING_URL)
            .otherServicesDescription(UPDATED_OTHER_SERVICES_DESCRIPTION)
            .organization(UPDATED_ORGANIZATION)
            .createdOn(UPDATED_CREATED_ON)
            .createdBy(UPDATED_CREATED_BY)
            .updatedOn(UPDATED_UPDATED_ON)
            .updatedBy(UPDATED_UPDATED_BY)
            .isActive(UPDATED_IS_ACTIVE);
        return parking;
    }

    @BeforeEach
    public void initTest() {
        parking = createEntity(em);
    }

    @Test
    @Transactional
    void createParking() throws Exception {
        int databaseSizeBeforeCreate = parkingRepository.findAll().size();
        // Create the Parking
        restParkingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parking)))
            .andExpect(status().isCreated());

        // Validate the Parking in the database
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeCreate + 1);
        Parking testParking = parkingList.get(parkingList.size() - 1);
        assertThat(testParking.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testParking.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testParking.getPlaces()).isEqualTo(DEFAULT_PLACES);
        assertThat(testParking.getRefrigeratedPlaces()).isEqualTo(DEFAULT_REFRIGERATED_PLACES);
        assertThat(testParking.getLzvPlaces()).isEqualTo(DEFAULT_LZV_PLACES);
        assertThat(testParking.getHourlyRate()).isEqualTo(DEFAULT_HOURLY_RATE);
        assertThat(testParking.getPricingUrl()).isEqualTo(DEFAULT_PRICING_URL);
        assertThat(testParking.getOtherServicesDescription()).isEqualTo(DEFAULT_OTHER_SERVICES_DESCRIPTION);
        assertThat(testParking.getOrganization()).isEqualTo(DEFAULT_ORGANIZATION);
        assertThat(testParking.getCreatedOn()).isEqualTo(DEFAULT_CREATED_ON);
        assertThat(testParking.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testParking.getUpdatedOn()).isEqualTo(DEFAULT_UPDATED_ON);
        assertThat(testParking.getUpdatedBy()).isEqualTo(DEFAULT_UPDATED_BY);
        assertThat(testParking.getIsActive()).isEqualTo(DEFAULT_IS_ACTIVE);
    }

    @Test
    @Transactional
    void createParkingWithExistingId() throws Exception {
        // Create the Parking with an existing ID
        parking.setId(1L);

        int databaseSizeBeforeCreate = parkingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restParkingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parking)))
            .andExpect(status().isBadRequest());

        // Validate the Parking in the database
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllParkings() throws Exception {
        // Initialize the database
        parkingRepository.saveAndFlush(parking);

        // Get all the parkingList
        restParkingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(parking.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].places").value(hasItem(DEFAULT_PLACES.intValue())))
            .andExpect(jsonPath("$.[*].refrigeratedPlaces").value(hasItem(DEFAULT_REFRIGERATED_PLACES.intValue())))
            .andExpect(jsonPath("$.[*].lzvPlaces").value(hasItem(DEFAULT_LZV_PLACES.intValue())))
            .andExpect(jsonPath("$.[*].hourlyRate").value(hasItem(DEFAULT_HOURLY_RATE.intValue())))
            .andExpect(jsonPath("$.[*].pricingUrl").value(hasItem(DEFAULT_PRICING_URL)))
            .andExpect(jsonPath("$.[*].otherServicesDescription").value(hasItem(DEFAULT_OTHER_SERVICES_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].organization").value(hasItem(DEFAULT_ORGANIZATION)))
            .andExpect(jsonPath("$.[*].createdOn").value(hasItem(DEFAULT_CREATED_ON.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].updatedOn").value(hasItem(DEFAULT_UPDATED_ON.toString())))
            .andExpect(jsonPath("$.[*].updatedBy").value(hasItem(DEFAULT_UPDATED_BY)))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE)));
    }

    @Test
    @Transactional
    void getParking() throws Exception {
        // Initialize the database
        parkingRepository.saveAndFlush(parking);

        // Get the parking
        restParkingMockMvc
            .perform(get(ENTITY_API_URL_ID, parking.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(parking.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.places").value(DEFAULT_PLACES.intValue()))
            .andExpect(jsonPath("$.refrigeratedPlaces").value(DEFAULT_REFRIGERATED_PLACES.intValue()))
            .andExpect(jsonPath("$.lzvPlaces").value(DEFAULT_LZV_PLACES.intValue()))
            .andExpect(jsonPath("$.hourlyRate").value(DEFAULT_HOURLY_RATE.intValue()))
            .andExpect(jsonPath("$.pricingUrl").value(DEFAULT_PRICING_URL))
            .andExpect(jsonPath("$.otherServicesDescription").value(DEFAULT_OTHER_SERVICES_DESCRIPTION))
            .andExpect(jsonPath("$.organization").value(DEFAULT_ORGANIZATION))
            .andExpect(jsonPath("$.createdOn").value(DEFAULT_CREATED_ON.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.updatedOn").value(DEFAULT_UPDATED_ON.toString()))
            .andExpect(jsonPath("$.updatedBy").value(DEFAULT_UPDATED_BY))
            .andExpect(jsonPath("$.isActive").value(DEFAULT_IS_ACTIVE));
    }

    @Test
    @Transactional
    void getNonExistingParking() throws Exception {
        // Get the parking
        restParkingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewParking() throws Exception {
        // Initialize the database
        parkingRepository.saveAndFlush(parking);

        int databaseSizeBeforeUpdate = parkingRepository.findAll().size();

        // Update the parking
        Parking updatedParking = parkingRepository.findById(parking.getId()).get();
        // Disconnect from session so that the updates on updatedParking are not directly saved in db
        em.detach(updatedParking);
        updatedParking
            .name(UPDATED_NAME)
            .location(UPDATED_LOCATION)
            .places(UPDATED_PLACES)
            .refrigeratedPlaces(UPDATED_REFRIGERATED_PLACES)
            .lzvPlaces(UPDATED_LZV_PLACES)
            .hourlyRate(UPDATED_HOURLY_RATE)
            .pricingUrl(UPDATED_PRICING_URL)
            .otherServicesDescription(UPDATED_OTHER_SERVICES_DESCRIPTION)
            .organization(UPDATED_ORGANIZATION)
            .createdOn(UPDATED_CREATED_ON)
            .createdBy(UPDATED_CREATED_BY)
            .updatedOn(UPDATED_UPDATED_ON)
            .updatedBy(UPDATED_UPDATED_BY)
            .isActive(UPDATED_IS_ACTIVE);

        restParkingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedParking.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedParking))
            )
            .andExpect(status().isOk());

        // Validate the Parking in the database
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeUpdate);
        Parking testParking = parkingList.get(parkingList.size() - 1);
        assertThat(testParking.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testParking.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testParking.getPlaces()).isEqualTo(UPDATED_PLACES);
        assertThat(testParking.getRefrigeratedPlaces()).isEqualTo(UPDATED_REFRIGERATED_PLACES);
        assertThat(testParking.getLzvPlaces()).isEqualTo(UPDATED_LZV_PLACES);
        assertThat(testParking.getHourlyRate()).isEqualTo(UPDATED_HOURLY_RATE);
        assertThat(testParking.getPricingUrl()).isEqualTo(UPDATED_PRICING_URL);
        assertThat(testParking.getOtherServicesDescription()).isEqualTo(UPDATED_OTHER_SERVICES_DESCRIPTION);
        assertThat(testParking.getOrganization()).isEqualTo(UPDATED_ORGANIZATION);
        assertThat(testParking.getCreatedOn()).isEqualTo(UPDATED_CREATED_ON);
        assertThat(testParking.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testParking.getUpdatedOn()).isEqualTo(UPDATED_UPDATED_ON);
        assertThat(testParking.getUpdatedBy()).isEqualTo(UPDATED_UPDATED_BY);
        assertThat(testParking.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void putNonExistingParking() throws Exception {
        int databaseSizeBeforeUpdate = parkingRepository.findAll().size();
        parking.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParkingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, parking.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parking in the database
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchParking() throws Exception {
        int databaseSizeBeforeUpdate = parkingRepository.findAll().size();
        parking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParkingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(parking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parking in the database
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamParking() throws Exception {
        int databaseSizeBeforeUpdate = parkingRepository.findAll().size();
        parking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParkingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(parking)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Parking in the database
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateParkingWithPatch() throws Exception {
        // Initialize the database
        parkingRepository.saveAndFlush(parking);

        int databaseSizeBeforeUpdate = parkingRepository.findAll().size();

        // Update the parking using partial update
        Parking partialUpdatedParking = new Parking();
        partialUpdatedParking.setId(parking.getId());

        partialUpdatedParking
            .refrigeratedPlaces(UPDATED_REFRIGERATED_PLACES)
            .lzvPlaces(UPDATED_LZV_PLACES)
            .hourlyRate(UPDATED_HOURLY_RATE)
            .pricingUrl(UPDATED_PRICING_URL)
            .createdOn(UPDATED_CREATED_ON)
            .createdBy(UPDATED_CREATED_BY)
            .updatedBy(UPDATED_UPDATED_BY)
            .isActive(UPDATED_IS_ACTIVE);

        restParkingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParking))
            )
            .andExpect(status().isOk());

        // Validate the Parking in the database
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeUpdate);
        Parking testParking = parkingList.get(parkingList.size() - 1);
        assertThat(testParking.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testParking.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testParking.getPlaces()).isEqualTo(DEFAULT_PLACES);
        assertThat(testParking.getRefrigeratedPlaces()).isEqualTo(UPDATED_REFRIGERATED_PLACES);
        assertThat(testParking.getLzvPlaces()).isEqualTo(UPDATED_LZV_PLACES);
        assertThat(testParking.getHourlyRate()).isEqualTo(UPDATED_HOURLY_RATE);
        assertThat(testParking.getPricingUrl()).isEqualTo(UPDATED_PRICING_URL);
        assertThat(testParking.getOtherServicesDescription()).isEqualTo(DEFAULT_OTHER_SERVICES_DESCRIPTION);
        assertThat(testParking.getOrganization()).isEqualTo(DEFAULT_ORGANIZATION);
        assertThat(testParking.getCreatedOn()).isEqualTo(UPDATED_CREATED_ON);
        assertThat(testParking.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testParking.getUpdatedOn()).isEqualTo(DEFAULT_UPDATED_ON);
        assertThat(testParking.getUpdatedBy()).isEqualTo(UPDATED_UPDATED_BY);
        assertThat(testParking.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void fullUpdateParkingWithPatch() throws Exception {
        // Initialize the database
        parkingRepository.saveAndFlush(parking);

        int databaseSizeBeforeUpdate = parkingRepository.findAll().size();

        // Update the parking using partial update
        Parking partialUpdatedParking = new Parking();
        partialUpdatedParking.setId(parking.getId());

        partialUpdatedParking
            .name(UPDATED_NAME)
            .location(UPDATED_LOCATION)
            .places(UPDATED_PLACES)
            .refrigeratedPlaces(UPDATED_REFRIGERATED_PLACES)
            .lzvPlaces(UPDATED_LZV_PLACES)
            .hourlyRate(UPDATED_HOURLY_RATE)
            .pricingUrl(UPDATED_PRICING_URL)
            .otherServicesDescription(UPDATED_OTHER_SERVICES_DESCRIPTION)
            .organization(UPDATED_ORGANIZATION)
            .createdOn(UPDATED_CREATED_ON)
            .createdBy(UPDATED_CREATED_BY)
            .updatedOn(UPDATED_UPDATED_ON)
            .updatedBy(UPDATED_UPDATED_BY)
            .isActive(UPDATED_IS_ACTIVE);

        restParkingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedParking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedParking))
            )
            .andExpect(status().isOk());

        // Validate the Parking in the database
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeUpdate);
        Parking testParking = parkingList.get(parkingList.size() - 1);
        assertThat(testParking.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testParking.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testParking.getPlaces()).isEqualTo(UPDATED_PLACES);
        assertThat(testParking.getRefrigeratedPlaces()).isEqualTo(UPDATED_REFRIGERATED_PLACES);
        assertThat(testParking.getLzvPlaces()).isEqualTo(UPDATED_LZV_PLACES);
        assertThat(testParking.getHourlyRate()).isEqualTo(UPDATED_HOURLY_RATE);
        assertThat(testParking.getPricingUrl()).isEqualTo(UPDATED_PRICING_URL);
        assertThat(testParking.getOtherServicesDescription()).isEqualTo(UPDATED_OTHER_SERVICES_DESCRIPTION);
        assertThat(testParking.getOrganization()).isEqualTo(UPDATED_ORGANIZATION);
        assertThat(testParking.getCreatedOn()).isEqualTo(UPDATED_CREATED_ON);
        assertThat(testParking.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testParking.getUpdatedOn()).isEqualTo(UPDATED_UPDATED_ON);
        assertThat(testParking.getUpdatedBy()).isEqualTo(UPDATED_UPDATED_BY);
        assertThat(testParking.getIsActive()).isEqualTo(UPDATED_IS_ACTIVE);
    }

    @Test
    @Transactional
    void patchNonExistingParking() throws Exception {
        int databaseSizeBeforeUpdate = parkingRepository.findAll().size();
        parking.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restParkingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, parking.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parking in the database
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchParking() throws Exception {
        int databaseSizeBeforeUpdate = parkingRepository.findAll().size();
        parking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParkingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(parking))
            )
            .andExpect(status().isBadRequest());

        // Validate the Parking in the database
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamParking() throws Exception {
        int databaseSizeBeforeUpdate = parkingRepository.findAll().size();
        parking.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restParkingMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(parking)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Parking in the database
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteParking() throws Exception {
        // Initialize the database
        parkingRepository.saveAndFlush(parking);

        int databaseSizeBeforeDelete = parkingRepository.findAll().size();

        // Delete the parking
        restParkingMockMvc
            .perform(delete(ENTITY_API_URL_ID, parking.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Parking> parkingList = parkingRepository.findAll();
        assertThat(parkingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
