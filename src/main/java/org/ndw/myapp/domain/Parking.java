package org.ndw.myapp.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;

/**
 * A Parking.
 */
@Entity
@Table(name = "parking")
public class Parking implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "places")
    private Long places;

    @Column(name = "refrigerated_places")
    private Long refrigeratedPlaces;

    @Column(name = "lzv_places")
    private Long lzvPlaces;

    @Column(name = "hourly_rate")
    private Long hourlyRate;

    @Column(name = "pricing_url")
    private String pricingUrl;

    @Column(name = "other_services_description")
    private String otherServicesDescription;

    @Column(name = "organization")
    private String organization;

    @Column(name = "created_on")
    private Instant createdOn;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_on")
    private Instant updatedOn;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "is_active")
    private String isActive;

    @ManyToOne
    private ParkingEntrance parking;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Parking id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Parking name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return this.location;
    }

    public Parking location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getPlaces() {
        return this.places;
    }

    public Parking places(Long places) {
        this.setPlaces(places);
        return this;
    }

    public void setPlaces(Long places) {
        this.places = places;
    }

    public Long getRefrigeratedPlaces() {
        return this.refrigeratedPlaces;
    }

    public Parking refrigeratedPlaces(Long refrigeratedPlaces) {
        this.setRefrigeratedPlaces(refrigeratedPlaces);
        return this;
    }

    public void setRefrigeratedPlaces(Long refrigeratedPlaces) {
        this.refrigeratedPlaces = refrigeratedPlaces;
    }

    public Long getLzvPlaces() {
        return this.lzvPlaces;
    }

    public Parking lzvPlaces(Long lzvPlaces) {
        this.setLzvPlaces(lzvPlaces);
        return this;
    }

    public void setLzvPlaces(Long lzvPlaces) {
        this.lzvPlaces = lzvPlaces;
    }

    public Long getHourlyRate() {
        return this.hourlyRate;
    }

    public Parking hourlyRate(Long hourlyRate) {
        this.setHourlyRate(hourlyRate);
        return this;
    }

    public void setHourlyRate(Long hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public String getPricingUrl() {
        return this.pricingUrl;
    }

    public Parking pricingUrl(String pricingUrl) {
        this.setPricingUrl(pricingUrl);
        return this;
    }

    public void setPricingUrl(String pricingUrl) {
        this.pricingUrl = pricingUrl;
    }

    public String getOtherServicesDescription() {
        return this.otherServicesDescription;
    }

    public Parking otherServicesDescription(String otherServicesDescription) {
        this.setOtherServicesDescription(otherServicesDescription);
        return this;
    }

    public void setOtherServicesDescription(String otherServicesDescription) {
        this.otherServicesDescription = otherServicesDescription;
    }

    public String getOrganization() {
        return this.organization;
    }

    public Parking organization(String organization) {
        this.setOrganization(organization);
        return this;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public Instant getCreatedOn() {
        return this.createdOn;
    }

    public Parking createdOn(Instant createdOn) {
        this.setCreatedOn(createdOn);
        return this;
    }

    public void setCreatedOn(Instant createdOn) {
        this.createdOn = createdOn;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public Parking createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getUpdatedOn() {
        return this.updatedOn;
    }

    public Parking updatedOn(Instant updatedOn) {
        this.setUpdatedOn(updatedOn);
        return this;
    }

    public void setUpdatedOn(Instant updatedOn) {
        this.updatedOn = updatedOn;
    }

    public String getUpdatedBy() {
        return this.updatedBy;
    }

    public Parking updatedBy(String updatedBy) {
        this.setUpdatedBy(updatedBy);
        return this;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getIsActive() {
        return this.isActive;
    }

    public Parking isActive(String isActive) {
        this.setIsActive(isActive);
        return this;
    }

    public void setIsActive(String isActive) {
        this.isActive = isActive;
    }

    public ParkingEntrance getParking() {
        return this.parking;
    }

    public void setParking(ParkingEntrance parkingEntrance) {
        this.parking = parkingEntrance;
    }

    public Parking parking(ParkingEntrance parkingEntrance) {
        this.setParking(parkingEntrance);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Parking)) {
            return false;
        }
        return id != null && id.equals(((Parking) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Parking{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", location='" + getLocation() + "'" +
            ", places=" + getPlaces() +
            ", refrigeratedPlaces=" + getRefrigeratedPlaces() +
            ", lzvPlaces=" + getLzvPlaces() +
            ", hourlyRate=" + getHourlyRate() +
            ", pricingUrl='" + getPricingUrl() + "'" +
            ", otherServicesDescription='" + getOtherServicesDescription() + "'" +
            ", organization='" + getOrganization() + "'" +
            ", createdOn='" + getCreatedOn() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", updatedOn='" + getUpdatedOn() + "'" +
            ", updatedBy='" + getUpdatedBy() + "'" +
            ", isActive='" + getIsActive() + "'" +
            "}";
    }
}
