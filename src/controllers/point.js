import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";

import {RenderPosition, render, replace} from "../utils/render.js";

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = null;
  }

  render(event) {
    this._pointComponent = new PointComponent(event);
    this._pointEditComponent = new PointEditComponent(event);

    this._pointComponent.setEditBtnClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setFavouriteBtnClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavourite: !event.isFavourite,
      }));
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this._replaceEditToPoint();
    });

    this._pointEditComponent.setCloseBtnClickHandler(() => {
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      this._replaceEditToPoint();
    });

    render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
  }

  _replacePointToEdit() {
    replace(this._pointEditComponent, this._pointComponent);
  }

  _replaceEditToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
  }

  _onEscKeyDown(evt) {
    const isEsc = evt.key === `Escape` || evt.key === `Esc`;
    if (isEsc) {
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
