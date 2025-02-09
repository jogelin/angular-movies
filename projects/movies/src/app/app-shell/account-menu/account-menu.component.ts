import {LetDirective} from '@rx-angular/template/let';
import {RxState} from '@rx-angular/state';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RxActionFactory} from '@rx-angular/state/actions';
import {AuthEffects} from '../../auth/auth.effects';
import {AuthState} from '../../state/auth.state';
import {map} from 'rxjs';
import {RouterLink} from '@angular/router';
import { RxEffects } from '@rx-angular/state/effects';
import { RxIf } from '@rx-angular/template/if';
import {AUTH_STATE_LOADED} from "../../auth/auth-state-available.token";

export const imports = [RouterLink, LetDirective, RxIf];


type Actions = {
  signOut: Event;
  signIn: Event;
};

@Component({
  standalone: true,
  imports: [RouterLink, RxIf, LetDirective],
  selector: 'ct-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, RxEffects],
})
export default class AccountMenuComponent {
  private readonly effects = inject(RxEffects);
  private readonly authEffects = inject(AuthEffects);
  private readonly authState = inject(AuthState);
  private readonly state = inject<RxState<{ loggedIn: boolean }>>(RxState);
  private readonly isAuthStateLoaded$ = inject(AUTH_STATE_LOADED);

  ui = this.actionsF.create();

  loggedIn$ = this.state.select('loggedIn');

  constructor(private actionsF: RxActionFactory<Actions>) {
    this.isAuthStateLoaded$.next(true);

    this.state.connect(
      'loggedIn',
      this.authState.requestToken$.pipe(map((s) => !!s))
    );
    this.effects.register(this.ui.signOut$, this.authEffects.signOut);
    this.effects.register(
      this.ui.signIn$,
      this.authEffects.approveRequestToken
    );
  }
}
