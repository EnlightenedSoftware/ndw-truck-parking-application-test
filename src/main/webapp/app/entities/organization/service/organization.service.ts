import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrganization, getOrganizationIdentifier } from '../organization.model';

export type EntityResponseType = HttpResponse<IOrganization>;
export type EntityArrayResponseType = HttpResponse<IOrganization[]>;

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organizations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(organization: IOrganization): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organization);
    return this.http
      .post<IOrganization>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(organization: IOrganization): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organization);
    return this.http
      .put<IOrganization>(`${this.resourceUrl}/${getOrganizationIdentifier(organization) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(organization: IOrganization): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(organization);
    return this.http
      .patch<IOrganization>(`${this.resourceUrl}/${getOrganizationIdentifier(organization) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrganization>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrganization[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrganizationToCollectionIfMissing(
    organizationCollection: IOrganization[],
    ...organizationsToCheck: (IOrganization | null | undefined)[]
  ): IOrganization[] {
    const organizations: IOrganization[] = organizationsToCheck.filter(isPresent);
    if (organizations.length > 0) {
      const organizationCollectionIdentifiers = organizationCollection.map(
        organizationItem => getOrganizationIdentifier(organizationItem)!
      );
      const organizationsToAdd = organizations.filter(organizationItem => {
        const organizationIdentifier = getOrganizationIdentifier(organizationItem);
        if (organizationIdentifier == null || organizationCollectionIdentifiers.includes(organizationIdentifier)) {
          return false;
        }
        organizationCollectionIdentifiers.push(organizationIdentifier);
        return true;
      });
      return [...organizationsToAdd, ...organizationCollection];
    }
    return organizationCollection;
  }

  protected convertDateFromClient(organization: IOrganization): IOrganization {
    return Object.assign({}, organization, {
      createdOn: organization.createdOn?.isValid() ? organization.createdOn.toJSON() : undefined,
      updatedOn: organization.updatedOn?.isValid() ? organization.updatedOn.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdOn = res.body.createdOn ? dayjs(res.body.createdOn) : undefined;
      res.body.updatedOn = res.body.updatedOn ? dayjs(res.body.updatedOn) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((organization: IOrganization) => {
        organization.createdOn = organization.createdOn ? dayjs(organization.createdOn) : undefined;
        organization.updatedOn = organization.updatedOn ? dayjs(organization.updatedOn) : undefined;
      });
    }
    return res;
  }
}
