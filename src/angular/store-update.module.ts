import {
  NgModule,
  Injectable,
  NO_ERRORS_SCHEMA,
  ModuleWithProviders,
} from '@angular/core'
import { StoreUpdate } from '../'
import { IStoreUpdateConfig } from '../interfaces'
import { StoreUpdateConfig } from './store-update-config.service'

@NgModule({
  declarations: [],
  providers: [ StoreUpdateConfig ],
  exports: [],
  schemas: [NO_ERRORS_SCHEMA]
})
export class StoreUpdateModule {

  constructor(config: StoreUpdateConfig) {
    if (!config) console.error('You need to provide a config to the forRoot method');
    new StoreUpdate(config)
  }

  static forRoot(config: StoreUpdateConfig): ModuleWithProviders {
    return {
        ngModule: StoreUpdateModule,
        providers: [
            { provide: StoreUpdateConfig, useValue: config },
        ]
    };
  }
}
