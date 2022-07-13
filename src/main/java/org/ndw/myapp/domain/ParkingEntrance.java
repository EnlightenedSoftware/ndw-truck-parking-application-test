package org.ndw.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A ParkingEntrance.
 */
@Entity
@Table(name = "parking_entrance")
public class ParkingEntrance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "location")
    private String location;

    @Column(name = "primary_road_id")
    private String primaryRoadId;

    @Column(name = "alternative_road_id")
    private String alternativeRoadId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ParkingEntrance id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLocation() {
        return this.location;
    }

    public ParkingEntrance location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPrimaryRoadId() {
        return this.primaryRoadId;
    }

    public ParkingEntrance primaryRoadId(String primaryRoadId) {
        this.setPrimaryRoadId(primaryRoadId);
        return this;
    }

    public void setPrimaryRoadId(String primaryRoadId) {
        this.primaryRoadId = primaryRoadId;
    }

    public String getAlternativeRoadId() {
        return this.alternativeRoadId;
    }

    public ParkingEntrance alternativeRoadId(String alternativeRoadId) {
        this.setAlternativeRoadId(alternativeRoadId);
        return this;
    }

    public void setAlternativeRoadId(String alternativeRoadId) {
        this.alternativeRoadId = alternativeRoadId;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ParkingEntrance)) {
            return false;
        }
        return id != null && id.equals(((ParkingEntrance) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ParkingEntrance{" +
            "id=" + getId() +
            ", location='" + getLocation() + "'" +
            ", primaryRoadId='" + getPrimaryRoadId() + "'" +
            ", alternativeRoadId='" + getAlternativeRoadId() + "'" +
            "}";
    }
}
